import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { ProductResDto } from 'src/common/dto/product-res.dto'
import { Category, Product } from 'src/entities'
import { ProductStatus } from 'src/entities/product.entity'
import { Repository } from 'typeorm'
import { GetCategoriesDto } from './dto'
import GetRecsDto from './dto/get-recs.dto'

@Injectable()
export default class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>
  ) {}

  async getAll(dto: GetCategoriesDto) {
    const { offset, limit } = dto
    const [rows, count] = await this.categoryRepo.findAndCount({
      select: ['id', 'name'],
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    })

    return { total: count, items: rows }
  }

  async getOne(id: number) {
    const category = await this.categoryRepo.findOne({
      select: ['id', 'name'],
      where: { id },
    })
    if (category) return category
    throw new Error('CATEGORY_NOT_FOUND')
  }

  async recommend(dto: GetRecsDto) {
    const { offset, limit } = dto
    const categories = await this.categoryRepo
      .createQueryBuilder('c')
      .select(['c.id', 'c.name'])
      .innerJoin('c.products', 'p', 'p.status = :status', {
        status: ProductStatus.PUBLISHED,
      })
      .groupBy('c.id')
      .orderBy('c.createdAt', 'DESC')
      .limit(4)
      .getMany()

    const promises = categories.map(category =>
      this.productRepo
        .createQueryBuilder('p')
        .select([
          'p.id id',
          'p.name name',
          'p.categoryId categoryId',
          'MIN(v.price) minPrice',
          'MAX(v.price) maxPrice',
          'SUM(v.sold) sold',
        ])
        .innerJoin('p.variants', 'v', 'p.status = :status AND p.categoryId = :cid', {
          status: ProductStatus.PUBLISHED,
          cid: category.id,
        })
        .innerJoin('p.productFiles', 'pf', 'pf.order IN (0,1)')
        .innerJoin('pf.file', 'f')
        .addSelect('MAX(CASE WHEN pf.`order` = 0 THEN f.name END)', 'thumb0')
        .addSelect('MAX(CASE WHEN pf.`order` = 1 THEN f.name END)', 'thumb1')
        .groupBy('p.id')
        .orderBy('p.createdAt', 'DESC')
        .offset(offset)
        .limit(limit)
        .getRawMany()
        .then(rows => ({
          ...category,
          products: rows.map(row =>
            plainToInstance(ProductResDto, row, { excludeExtraneousValues: true })
          ),
        }))
    )

    return await Promise.all(promises)
  }
}
