import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductVariant, PriceRule } from '../../database/entities';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductVariantsService } from './product-variants.service';
import { PriceRulesService } from './price-rules.service';
import { PricingEngineService } from './pricing-engine.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductVariant, PriceRule]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductVariantsService, PriceRulesService, PricingEngineService],
  exports: [ProductsService, ProductVariantsService, PriceRulesService, PricingEngineService],
})
export class ProductsModule {}
