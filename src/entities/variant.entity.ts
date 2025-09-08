import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import Option from './option.entity'
import Product from './product.entity'

@Entity('Variant')
export default class Variant {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number

  @Column({ type: 'int', unsigned: true, default: 0 })
  quantity: number

  @Column({ type: 'int', unsigned: true, default: 0 })
  sold: number

  @Column({ type: 'decimal', unsigned: true, default: 0 })
  price: number

  @Column({ type: 'int', unsigned: true })
  productId: number

  @ManyToOne(() => Product, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  product: Product

  @ManyToMany(() => Option, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinTable({ name: 'Variant_Option' })
  options: Option[]
}
