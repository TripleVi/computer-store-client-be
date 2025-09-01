import { Injectable } from '@nestjs/common'
// import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from 'src/entities'
import { Repository } from 'typeorm'

@Injectable()
export default class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>
    // private readonly configService: ConfigService
  ) {}

  findAll() {
    return this.categoryRepo.find({ relations: { products: true } })
  }
}
