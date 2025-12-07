import { PartialType } from '@nestjs/swagger';
import { CreateSalesOrderDto, CreateSalesOrderLineDto } from './create-sales-order.dto';

export { CreateSalesOrderLineDto };
export class UpdateSalesOrderDto extends PartialType(CreateSalesOrderDto) {}
