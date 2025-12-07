import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesQuote, SalesQuoteLine, SalesOrder, SalesOrderLine } from '../../database/entities';
import { SalesController } from './sales.controller';
import { SalesQuotesService } from './sales-quotes.service';
import { SalesOrdersService } from './sales-orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SalesQuote, SalesQuoteLine, SalesOrder, SalesOrderLine]),
  ],
  controllers: [SalesController],
  providers: [SalesQuotesService, SalesOrdersService],
  exports: [SalesQuotesService, SalesOrdersService],
})
export class SalesModule {}
