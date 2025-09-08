import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import Type from './type.entity'
import Variant from './variant.entity'
import File from './file.entity'

@Entity()
export default class Option {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  order: number

  @Column({ type: 'int', unsigned: true })
  typeId: number

  @Column({ type: 'int', unsigned: true })
  fileId: number

  @ManyToOne(() => Type, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  type: Type

  @ManyToOne(() => File, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  file: File

  @ManyToMany(() => Variant)
  variants: Variant[]
}
