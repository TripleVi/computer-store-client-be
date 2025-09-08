import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import File from './file.entity'
import Product from './product.entity'

@Entity()
export default class ProductFile {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  order: number

  @Column({ type: 'int', unsigned: true })
  productId: number

  @Column({ type: 'int', unsigned: true })
  fileId: number

  @ManyToOne(() => Product, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  product: Product

  @ManyToOne(() => File, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  file: File
}
