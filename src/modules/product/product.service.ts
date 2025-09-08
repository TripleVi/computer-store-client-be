import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { Product } from 'src/entities'
import { ProductStatus } from 'src/entities/product.entity'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { ProductCardDto } from './dto/product-card.dto'
import { ProductDto } from './dto/product.dto'
import RecommendProductsDto from './dto/recommend-products.dto'
import SearchProductsDto from './dto/search-products.dto'

@Injectable()
export default class ProductService {
  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>
  ) {}

  async productExists(id: number) {
    return !!(await this.productRepo.findOne({
      select: ['id'],
      where: { id, status: ProductStatus.PUBLISHED },
    }))
  }

  async getOne(id: number) {
    if (!(await this.productExists(id))) {
      throw new Error('PRODUCT_NOT_FOUND')
    }
    return this.productRepo
      .createQueryBuilder('p')
      .select(
        'p.id, p.name, p.description, c.id, c.name, t.id, t.name, o.id, o.name, of.name, pf.id, pff.name, v.quantity, v.sold, v.price'.split(
          ', '
        )
      )
      .innerJoin('p.category', 'c', 'p.id = :id', { id })
      .innerJoin('p.types', 't')
      .innerJoin('t.options', 'o')
      .innerJoin('o.file', 'of')
      .innerJoin('p.productFiles', 'pf')
      .innerJoin('pf.file', 'pff')
      .innerJoin('p.variants', 'v')
      .orderBy('t.order')
      .addOrderBy('o.order')
      .getOne()
      .then(e => plainToInstance(ProductDto, e, { excludeExtraneousValues: true }))
  }

  private toProductCardDto(raw: any[], entities: Product[]) {
    const rows = (raw as Record<string, any>[]).filter(
      (row, i, arr) => row.pid !== arr[i - 1]?.pid
    )
    return entities.map((e, i) => {
      const ins = plainToInstance(ProductCardDto, e, {
        excludeExtraneousValues: true,
      })
      ins.minPrice = rows[i].minPrice as number
      ins.maxPrice = rows[i].maxPrice as number
      ins.sold = rows[i].sold as number
      return ins
    })
  }

  private createGetAllQueryBuilder(): SelectQueryBuilder<Product> {
    return this.productRepo
      .createQueryBuilder('product')
      .select(['product.id', 'product.name', 'pf.id', 'pff.name', ''])
      .addSelect('product.id', 'pid')
      .addSelect('MIN(v.price)', 'minPrice')
      .addSelect('MAX(v.price)', 'maxPrice')
      .addSelect('SUM(v.sold)', 'sold')
      .addSelect('COUNT(*) OVER ()', 'count')
      .innerJoin('product.variants', 'v', 'product.status = :status', {
        status: ProductStatus.PUBLISHED,
      })
      .innerJoin('product.productFiles', 'pf', 'pf.order IN (:...orders)', {
        orders: [0, 1],
      })
      .innerJoin('pf.file', 'pff')
      .groupBy('product.id')
      .addGroupBy('pf.id')
  }

  async search(dto: SearchProductsDto) {
    const { categoryId, by, order, offset, limit, minPrice, maxPrice } = dto

    if (categoryId) {
      const count = await this.productRepo.countBy({ categoryId })
      if (count === 0) return { total: 0, items: [] }
    }
    const qb = this.createGetAllQueryBuilder()
    if (by === 'price') {
      qb.orderBy('minPrice', order)
    } else {
      qb.orderBy('product.createdAt', order)
    }
    if (categoryId) {
      qb.where('product.categoryId = :categoryId', { categoryId })
    }
    if (minPrice) qb.having('minPrice >= :minPrice', { minPrice })
    if (maxPrice) qb.andHaving('minPrice <= :maxPrice', { maxPrice })

    return qb
      .offset(offset)
      .limit(limit * 2)
      .getRawAndEntities()
      .then(res => {
        const raw = res.raw as Record<string, unknown>[]
        return {
          total: raw.length && (raw[0].count as number) / 2,
          items: this.toProductCardDto(res.raw, res.entities),
        }
      })
  }

  async recommend(dto: RecommendProductsDto) {
    const { section, categoryId, productId, offset, limit } = dto
    let total = 0
    let items = new Array<ProductCardDto>()
    if (section === 'you_may_also_like') {
      total = await this.productRepo.countBy({
        status: ProductStatus.PUBLISHED,
        categoryId,
      })
      items = await this.productRepo
        .createQueryBuilder('p')
        .select(['p.id', 'p.name', 'pf.id', 'pff.name'])
        .addSelect('p.id', 'pid')
        .addSelect('MIN(v.price)', 'minPrice')
        .addSelect('MAX(v.price)', 'maxPrice')
        .addSelect('SUM(v.sold)', 'sold')
        .innerJoin('p.variants', 'v')
        .innerJoin('p.productFiles', 'pf', 'pf.order IN (:...orders)', { orders: [0, 1] })
        .innerJoin('pf.file', 'pff')
        .where('p.id <> :id', { id: productId })
        .andWhere('p.status = :status', { status: ProductStatus.PUBLISHED })
        .andWhere('p.categoryId = :cid', { cid: categoryId })
        .groupBy('p.id')
        .addGroupBy('pf.id')
        .orderBy('p.views', 'DESC')
        .addOrderBy('p.createdAt', 'DESC')
        .offset(offset)
        .limit(limit * 2)
        .getRawAndEntities()
        .then(res => this.toProductCardDto(res.raw, res.entities))
    }
    return { total, key: section, items }
  }
}
