import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, Tenant, AuditLog } from '../../database/entities';
import { SignupDto, LoginDto, RefreshTokenDto } from './dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  private refreshTokens = new Map<string, { userId: string; expiresAt: Date }>();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Verify tenant exists and is active
    const tenant = await this.tenantRepository.findOne({
      where: { id: dto.tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    if (!tenant.isActive) {
      throw new UnauthorizedException('Tenant is not active');
    }

    // Hash password
    const passwordHash = await argon2.hash(dto.password);

    // Create user
    const user = this.userRepository.create({
      email: dto.email,
      displayName: dto.displayName,
      passwordHash,
      tenantId: dto.tenantId,
      isActive: true,
    });

    await this.userRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Log signup
    await this.auditLogRepository.save({
      tenantId: user.tenantId,
      actorUserId: user.id,
      action: 'signup',
      objectType: 'user',
      objectId: user.id,
      after: { email: user.email },
    });

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    // Find user
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      relations: ['tenant', 'roles', 'roles.permissions'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Check if tenant is active
    if (!user.tenant.isActive) {
      throw new UnauthorizedException('Tenant is not active');
    }

    // Verify password
    const isPasswordValid = await argon2.verify(user.passwordHash, dto.password);

    if (!isPasswordValid) {
      // Log failed login attempt
      await this.auditLogRepository.save({
        tenantId: user.tenantId,
        actorUserId: user.id,
        action: 'login_failed',
        objectType: 'user',
        objectId: user.id,
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await this.userRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Log successful login
    await this.auditLogRepository.save({
      tenantId: user.tenantId,
      actorUserId: user.id,
      action: 'login',
      objectType: 'user',
      objectId: user.id,
    });

    return {
      user: this.sanitizeUser(user),
      tenant: {
        id: user.tenant.id,
        name: user.tenant.name,
        slug: user.tenant.slug,
        logoUrl: user.tenant.logoUrl,
        primaryColor: user.tenant.primaryColor,
      },
      ...tokens,
    };
  }

  async refresh(dto: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.userId },
        relations: ['tenant'],
      });

      if (!user || !user.isActive || !user.tenant.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    // In a real application, you'd invalidate the token in Redis
    // For now, we'll just log the logout
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (user) {
      await this.auditLogRepository.save({
        tenantId: user.tenantId,
        actorUserId: user.id,
        action: 'logout',
        objectType: 'user',
        objectId: user.id,
      });
    }

    return { message: 'Logged out successfully' };
  }

  async me(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['tenant', 'roles', 'roles.permissions'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user: this.sanitizeUser(user),
      tenant: {
        id: user.tenant.id,
        name: user.tenant.name,
        slug: user.tenant.slug,
        logoUrl: user.tenant.logoUrl,
        primaryColor: user.tenant.primaryColor,
      },
      roles: user.roles.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
      })),
      permissions: user.roles.flatMap((role) =>
        role.permissions.map((p) => p.code),
      ),
    };
  }

  private async generateTokens(user: User) {
    const payload = {
      userId: user.id,
      email: user.email,
      tenantId: user.tenantId,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
    });

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: User) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}
