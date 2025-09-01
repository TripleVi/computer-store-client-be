import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import Category from './category.entity'
import ProductFile from './product-file.entity'
import Type from './type.entity'
import Variant from './variant.entity'

export enum ProductStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Entity()
export default class Product {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  description: string

  @Column({ type: 'int', unsigned: true, default: 0 })
  views: number

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.DRAFT,
  })
  status: ProductStatus

  @Column({ type: 'int', unsigned: true })
  categoryId: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => Category, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  category: Category

  @OneToMany(() => ProductFile, p => p.product)
  productFiles: ProductFile[]

  @OneToMany(() => Type, t => t.product)
  types: Type[]

  @OneToMany(() => Variant, v => v.product)
  variants: Variant[]
}
