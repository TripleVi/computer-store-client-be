import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Variant } from 'src/entities'
import { Repository } from 'typeorm'

@Injectable()
export class VariantService {
  constructor(
    @InjectRepository(Variant) private readonly variantRepo: Repository<Variant>
  ) {}
}
