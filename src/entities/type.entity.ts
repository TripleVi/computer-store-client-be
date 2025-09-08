import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import Option from './option.entity'
import Product from './product.entity'

@Entity('Type')
export default class Type {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  order: number

  @Column({ type: 'int', unsigned: true })
  productId: number

  @ManyToOne(() => Product, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  product: Product

  @OneToMany(() => Option, o => o.type)
  options: Option[]
}
