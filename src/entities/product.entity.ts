import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export default class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  views: number

  @Column()
  description: boolean

  @Column({ name: 'created_at' })
  createdAt: Date

  @Column({ name: 'updated_at' })
  updatedAt: Date
}
