import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PosSession, PosSessionStatus } from '../../database/entities';
import { CreatePosSessionDto, ClosePosSessionDto, PosSessionFilterDto } from './dto/pos-session.dto';

@Injectable()
export class PosSessionsService {
  constructor(
    @InjectRepository(PosSession)
    private readonly posSessionRepository: Repository<PosSession>,
  ) {}

  async create(createDto: CreatePosSessionDto, userId: string): Promise<PosSession> {
    // Check if user has an open session
    const openSession = await this.posSessionRepository.findOne({
      where: {
        openedByUserId: userId,
        status: PosSessionStatus.OPEN,
      },
    });

    if (openSession) {
      throw new BadRequestException('User already has an open POS session');
    }

    const session = this.posSessionRepository.create({
      ...createDto,
      openedByUserId: userId,
      openedAt: new Date(),
      status: PosSessionStatus.OPEN,
    });

    return this.posSessionRepository.save(session);
  }

  async findAll(filters?: PosSessionFilterDto): Promise<PosSession[]> {
    const query = this.posSessionRepository.createQueryBuilder('session');

    if (filters?.status) {
      query.andWhere('session.status = :status', { status: filters.status });
    }

    if (filters?.openedByUserId) {
      query.andWhere('session.openedByUserId = :userId', { userId: filters.openedByUserId });
    }

    query.orderBy('session.openedAt', 'DESC');

    return query.getMany();
  }

  async findOne(id: string): Promise<PosSession> {
    const session = await this.posSessionRepository.findOne({
      where: { id },
      relations: ['transactions'],
    });

    if (!session) {
      throw new NotFoundException(`POS Session with ID ${id} not found`);
    }

    return session;
  }

  async closeSession(id: string, closeDto: ClosePosSessionDto, userId: string): Promise<PosSession> {
    const session = await this.findOne(id);

    if (session.openedByUserId !== userId) {
      throw new BadRequestException('Only the user who opened the session can close it');
    }

    if (session.status === PosSessionStatus.CLOSED) {
      throw new BadRequestException('Session is already closed');
    }

    session.status = PosSessionStatus.CLOSED;
    session.closedAt = new Date();
    session.closingBalance = closeDto.closingBalance;
    if (closeDto.notes) {
      session.notes = closeDto.notes;
    }

    return this.posSessionRepository.save(session);
  }

  async getCurrentSession(userId: string): Promise<PosSession | null> {
    return this.posSessionRepository.findOne({
      where: {
        openedByUserId: userId,
        status: PosSessionStatus.OPEN,
      },
      relations: ['transactions'],
    });
  }
}
