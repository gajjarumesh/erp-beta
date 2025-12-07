import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { Product } from '../../database/entities';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(tenantId: string, dto: CreateProductDto): Promise<Product> {
    // Check if SKU already exists
    const existing = await this.productRepository.findOne({
      where: { tenantId, sku: dto.sku },
    });

    if (existing) {
      throw new ConflictException('Product with this SKU already exists');
    }

    const product = this.productRepository.create({
      ...dto,
      tenantId,
    });

    return await this.productRepository.save(product);
  }

  async findAll(
    tenantId: string,
    filters?: {
      search?: string;
      isActive?: boolean;
      page?: number;
      limit?: number;
    },
  ): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Product> = { tenantId };

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.search) {
      // For simple search, we can use Like. For Meilisearch integration, this would be replaced.
      where.name = Like(`%${filters.search}%`);
    }

    const [data, total] = await this.productRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(tenantId: string, id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, tenantId },
      relations: ['variants'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(tenantId: string, id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(tenantId, id);

    // Check for SKU conflict if SKU is being updated
    if (dto.sku && dto.sku !== product.sku) {
      const existing = await this.productRepository.findOne({
        where: { tenantId, sku: dto.sku },
      });

      if (existing) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    Object.assign(product, dto);

    return await this.productRepository.save(product);
  }

  async remove(tenantId: string, id: string): Promise<void> {
    const product = await this.findOne(tenantId, id);
    await this.productRepository.softRemove(product);
  }

  async search(tenantId: string, query: string, limit = 10): Promise<Product[]> {
    return await this.productRepository.find({
      where: [
        { tenantId, sku: Like(`%${query}%`), isActive: true },
        { tenantId, name: Like(`%${query}%`), isActive: true },
      ],
      take: limit,
      order: { name: 'ASC' },
    });
  }
}
