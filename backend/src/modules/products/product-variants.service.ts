import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from '../../database/entities';
import { CreateProductVariantDto, UpdateProductVariantDto } from './dto';

@Injectable()
export class ProductVariantsService {
  constructor(
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
  ) {}

  async create(tenantId: string, dto: CreateProductVariantDto): Promise<ProductVariant> {
    // Check if SKU already exists
    const existing = await this.productVariantRepository.findOne({
      where: { tenantId, sku: dto.sku },
    });

    if (existing) {
      throw new ConflictException('Product variant with this SKU already exists');
    }

    const variant = this.productVariantRepository.create({
      ...dto,
      tenantId,
    });

    return await this.productVariantRepository.save(variant);
  }

  async findByProduct(tenantId: string, productId: string): Promise<ProductVariant[]> {
    return await this.productVariantRepository.find({
      where: { tenantId, productId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(tenantId: string, id: string): Promise<ProductVariant> {
    const variant = await this.productVariantRepository.findOne({
      where: { id, tenantId },
      relations: ['product'],
    });

    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }

    return variant;
  }

  async update(tenantId: string, id: string, dto: UpdateProductVariantDto): Promise<ProductVariant> {
    const variant = await this.findOne(tenantId, id);

    // Check for SKU conflict if SKU is being updated
    if (dto.sku && dto.sku !== variant.sku) {
      const existing = await this.productVariantRepository.findOne({
        where: { tenantId, sku: dto.sku },
      });

      if (existing) {
        throw new ConflictException('Product variant with this SKU already exists');
      }
    }

    Object.assign(variant, dto);

    return await this.productVariantRepository.save(variant);
  }

  async remove(tenantId: string, id: string): Promise<void> {
    const variant = await this.findOne(tenantId, id);
    await this.productVariantRepository.softRemove(variant);
  }
}
