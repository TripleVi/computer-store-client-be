import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('File')
export default class File {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number

  @Column({ type: 'varchar', length: 500 })
  url?: string

  @Column({ type: 'varchar', unique: true })
  name: string

  @Column({ type: 'varchar' })
  originalName: string

  @Column({ type: 'int', unsigned: true })
  size: number

  @Column({ type: 'varchar' })
  mimetype: string

  @CreateDateColumn()
  createdAt: Date
}
