import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards';
import { RequirePermissions, CurrentUser } from '../../common/decorators';
import { ProductsService, ProductVariantsService, PriceRulesService, PricingEngineService } from './';
import {
  CreateProductDto,
  UpdateProductDto,
  CreateProductVariantDto,
  UpdateProductVariantDto,
  CreatePriceRuleDto,
  UpdatePriceRuleDto,
} from './dto';

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productVariantsService: ProductVariantsService,
    private readonly priceRulesService: PriceRulesService,
    private readonly pricingEngineService: PricingEngineService,
  ) {}

  // ==================== PRODUCTS ====================
  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @RequirePermissions('product:create')
  async createProduct(@CurrentUser('tenantId') tenantId: string, @Body() dto: CreateProductDto) {
    const product = await this.productsService.create(tenantId, dto);
    return { success: true, data: product };
  }

  @Get()
  @ApiOperation({ summary: 'List all products' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @RequirePermissions('product:read')
  async listProducts(
    @CurrentUser('tenantId') tenantId: string,
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.productsService.findAll(tenantId, {
      search,
      isActive: isActive ? isActive === 'true' : undefined,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
    return { success: true, ...result };
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products by SKU or name' })
  @ApiQuery({ name: 'q', required: true })
  @ApiQuery({ name: 'limit', required: false })
  @RequirePermissions('product:read')
  async searchProducts(
    @CurrentUser('tenantId') tenantId: string,
    @Query('q') query: string,
    @Query('limit') limit?: string,
  ) {
    const products = await this.productsService.search(tenantId, query, limit ? parseInt(limit) : 10);
    return { success: true, data: products };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @RequirePermissions('product:read')
  async getProduct(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    const product = await this.productsService.findOne(tenantId, id);
    return { success: true, data: product };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product' })
  @RequirePermissions('product:update')
  async updateProduct(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    const product = await this.productsService.update(tenantId, id, dto);
    return { success: true, data: product };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  @RequirePermissions('product:delete')
  async deleteProduct(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    await this.productsService.remove(tenantId, id);
    return { success: true, message: 'Product deleted successfully' };
  }

  // ==================== PRODUCT VARIANTS ====================
  @Post('variants')
  @ApiOperation({ summary: 'Create a new product variant' })
  @RequirePermissions('product:create')
  async createVariant(@CurrentUser('tenantId') tenantId: string, @Body() dto: CreateProductVariantDto) {
    const variant = await this.productVariantsService.create(tenantId, dto);
    return { success: true, data: variant };
  }

  @Get(':productId/variants')
  @ApiOperation({ summary: 'List all variants for a product' })
  @RequirePermissions('product:read')
  async listVariants(
    @CurrentUser('tenantId') tenantId: string,
    @Param('productId') productId: string,
  ) {
    const variants = await this.productVariantsService.findByProduct(tenantId, productId);
    return { success: true, data: variants };
  }

  @Get('variants/:id')
  @ApiOperation({ summary: 'Get product variant by ID' })
  @RequirePermissions('product:read')
  async getVariant(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    const variant = await this.productVariantsService.findOne(tenantId, id);
    return { success: true, data: variant };
  }

  @Put('variants/:id')
  @ApiOperation({ summary: 'Update product variant' })
  @RequirePermissions('product:update')
  async updateVariant(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateProductVariantDto,
  ) {
    const variant = await this.productVariantsService.update(tenantId, id, dto);
    return { success: true, data: variant };
  }

  @Delete('variants/:id')
  @ApiOperation({ summary: 'Delete product variant' })
  @RequirePermissions('product:delete')
  async deleteVariant(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    await this.productVariantsService.remove(tenantId, id);
    return { success: true, message: 'Product variant deleted successfully' };
  }

  // ==================== PRICE RULES ====================
  @Post('price-rules')
  @ApiOperation({ summary: 'Create a new price rule' })
  @RequirePermissions('product:create')
  async createPriceRule(@CurrentUser('tenantId') tenantId: string, @Body() dto: CreatePriceRuleDto) {
    const priceRule = await this.priceRulesService.create(tenantId, dto);
    return { success: true, data: priceRule };
  }

  @Get('price-rules')
  @ApiOperation({ summary: 'List all price rules' })
  @ApiQuery({ name: 'activeOnly', required: false })
  @RequirePermissions('product:read')
  async listPriceRules(
    @CurrentUser('tenantId') tenantId: string,
    @Query('activeOnly') activeOnly?: string,
  ) {
    const priceRules = await this.priceRulesService.findAll(tenantId, activeOnly === 'true');
    return { success: true, data: priceRules };
  }

  @Get('price-rules/:id')
  @ApiOperation({ summary: 'Get price rule by ID' })
  @RequirePermissions('product:read')
  async getPriceRule(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    const priceRule = await this.priceRulesService.findOne(tenantId, id);
    return { success: true, data: priceRule };
  }

  @Put('price-rules/:id')
  @ApiOperation({ summary: 'Update price rule' })
  @RequirePermissions('product:update')
  async updatePriceRule(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePriceRuleDto,
  ) {
    const priceRule = await this.priceRulesService.update(tenantId, id, dto);
    return { success: true, data: priceRule };
  }

  @Delete('price-rules/:id')
  @ApiOperation({ summary: 'Delete price rule' })
  @RequirePermissions('product:delete')
  async deletePriceRule(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    await this.priceRulesService.remove(tenantId, id);
    return { success: true, message: 'Price rule deleted successfully' };
  }

  // ==================== PRICING ENGINE ====================
  @Post('calculate-price')
  @ApiOperation({ summary: 'Calculate final price for a product' })
  @RequirePermissions('product:read')
  async calculatePrice(
    @CurrentUser('tenantId') tenantId: string,
    @Body() body: { productId: string; basePrice: number; quantity: number; customerId?: string },
  ) {
    const result = await this.pricingEngineService.calculatePrice(tenantId, body.basePrice, {
      productId: body.productId,
      quantity: body.quantity,
      customerId: body.customerId,
    });
    return { success: true, data: result };
  }
}
