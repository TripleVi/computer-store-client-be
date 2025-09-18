import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VariantController } from './variant.controller'
import { VariantService } from './variant.service'
import { Variant } from 'src/entities'

@Module({
  imports: [TypeOrmModule.forFeature([Variant])],
  controllers: [VariantController],
  providers: [VariantService],
})
export default class VariantModule {}
