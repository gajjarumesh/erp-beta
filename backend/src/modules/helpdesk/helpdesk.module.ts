import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpdeskController } from './helpdesk.controller';
import { HelpdeskService } from './helpdesk.service';
import {
  Ticket,
  TicketComment,
  SlaRule,
} from '../../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ticket,
      TicketComment,
      SlaRule,
    ]),
  ],
  controllers: [HelpdeskController],
  providers: [HelpdeskService],
  exports: [HelpdeskService],
})
export class HelpdeskModule {}
