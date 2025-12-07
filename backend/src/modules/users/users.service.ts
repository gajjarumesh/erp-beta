import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User, Role } from '../../database/entities';
import { CreateUserDto, UpdateUserDto } from './dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(tenantId: string, dto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = this.userRepository.create({
      tenantId,
      email: dto.email,
      displayName: dto.displayName,
      passwordHash,
      isActive: dto.isActive ?? true,
    });

    await this.userRepository.save(user);

    if (dto.roleIds && dto.roleIds.length > 0) {
      const roles = await this.roleRepository.findBy({ id: In(dto.roleIds) });
      user.roles = roles;
      await this.userRepository.save(user);
    }

    return user;
  }

  async findAll(tenantId: string): Promise<User[]> {
    return this.userRepository.find({
      where: { tenantId },
      relations: ['roles'],
    });
  }

  async findOne(id: string, tenantId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, tenantId },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, tenantId: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id, tenantId);

    if (dto.displayName) user.displayName = dto.displayName;
    if (dto.isActive !== undefined) user.isActive = dto.isActive;

    await this.userRepository.save(user);

    if (dto.roleIds) {
      const roles = await this.roleRepository.findBy({ id: In(dto.roleIds) });
      user.roles = roles;
      await this.userRepository.save(user);
    }

    return this.findOne(id, tenantId);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const user = await this.findOne(id, tenantId);
    await this.userRepository.remove(user);
  }
}
