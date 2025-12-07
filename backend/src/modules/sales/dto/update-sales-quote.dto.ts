import { PartialType } from '@nestjs/swagger';
import { CreateSalesQuoteDto, CreateSalesQuoteLineDto } from './create-sales-quote.dto';

export { CreateSalesQuoteLineDto };
export class UpdateSalesQuoteDto extends PartialType(CreateSalesQuoteDto) {}
