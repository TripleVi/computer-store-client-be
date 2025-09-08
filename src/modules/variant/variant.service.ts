import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { Variant } from 'src/entities'
import { Repository } from 'typeorm'
import GetVariantsDto from './dto/get-variants.dto'
import VariantCardDto from './dto/variant-card.dto'

@Injectable()
export class VariantService {
  constructor(
    @InjectRepository(Variant) private readonly variantRepo: Repository<Variant>
  ) {}

  async getAll(dto: GetVariantsDto) {
    const { ids } = dto
    const variants = await this.variantRepo
      .createQueryBuilder('v')
      .select(['v.id', 'v.price', 'p.id', 'p.name', 'o.name', 'of.name'])
      .innerJoin('v.product', 'p', 'v.id IN (:...ids)', { ids })
      .innerJoin('v.options', 'o')
      .innerJoin('o.file', 'of')
      .getMany()
    return variants.map(v =>
      plainToInstance(VariantCardDto, v, { excludeExtraneousValues: true })
    )
  }
}
