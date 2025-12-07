import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PosSession, PosTransaction } from '../../database/entities';
import { PosController } from './pos.controller';
import { PosSessionsService } from './pos-sessions.service';
import { PosTransactionsService } from './pos-transactions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PosSession, PosTransaction]),
  ],
  controllers: [PosController],
  providers: [PosSessionsService, PosTransactionsService],
  exports: [PosSessionsService, PosTransactionsService],
})
export class PosModule {}
