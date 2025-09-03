import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { Product } from 'src/entities'
import { ProductStatus } from 'src/entities/product.entity'
import { Repository } from 'typeorm'
import { ProductCardDto } from './dto/product-card.dto'
import { ProductResDto } from './dto/product-res.dto'
import RecommendProductsDto from './dto/recommend-products.dto'

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
      .innerJoin('p.category', 'c')
      .innerJoin('p.types', 't')
      .innerJoin('t.options', 'o')
      .innerJoin('o.file', 'of')
      .innerJoin('p.productFiles', 'pf', 'pf.order IN (0,1)')
      .innerJoin('pf.file', 'pff')
      .innerJoin('p.variants', 'v')
      .orderBy('t.order')
      .addOrderBy('o.order')
      .getMany()
      .then(e => plainToInstance(ProductResDto, e, { excludeExtraneousValues: true }))
  }

  async recommend(dto: RecommendProductsDto) {
    const { section, categoryId, productId, offset, limit } = dto
    if (section === 'you_may_also_like') {
      return this.productRepo
        .createQueryBuilder('p')
        .select(['p.id', 'p.name', 'pf.id', 'pff.name'])
        .addSelect('p.id', 'pid')
        .addSelect('MIN(v.price)', 'minPrice')
        .addSelect('MAX(v.price)', 'maxPrice')
        .addSelect('SUM(v.sold)', 'sold')
        .innerJoin('p.variants', 'v')
        .innerJoin('p.productFiles', 'pf', 'pf.order IN (:...orders)', { orders: [1, 2] })
        .innerJoin('pf.file', 'pff')
        .where('p.id <> :id', { id: productId })
        .andWhere('p.status = :status', { status: ProductStatus.PUBLISHED })
        .andWhere('p.categoryId = :cid', { cid: categoryId })
        .groupBy('p.id')
        .addGroupBy('pf.id')
        .orderBy('p.views', 'DESC')
        .addOrderBy('p.createdAt', 'DESC')
        .offset(offset)
        .limit(limit)
        .getRawAndEntities()
        .then(res => {
          const { raw, entities } = res
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
        })
    }
    return []
  }
}
