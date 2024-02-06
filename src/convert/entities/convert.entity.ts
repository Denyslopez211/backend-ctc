import { ApiProperty } from '@nestjs/swagger';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../auth/entities';

@Entity('convert')
export class Convert {
  @ApiProperty({
    example: '345335-678768-fh4fh-45634',
    description: 'History ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: '10',
    description: 'originAmount',
  })
  @Column('integer')
  originAmount: number;

  @ApiProperty({
    example: '22/05/23',
    description: 'dateConvert',
  })
  @Column('varchar')
  dateConvert: string;

  @ApiProperty({
    example: '30500',
    description: 'valueUF',
  })
  @Column('varchar')
  valueUF: string;

  @ApiProperty({
    example: '30500',
    description: 'valueCLP',
  })
  @Column('varchar')
  valueCLP: string;

  @ApiProperty({
    example: '2023-08-02T17:28:17.219Z',
    description: 'Action creation date',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.convert, { eager: true })
  user: User;
}
