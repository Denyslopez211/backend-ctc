import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { History } from './history.entity';
import { ROL } from '../constants';
import { Convert } from '../../convert/entities/convert.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false, length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false, select: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  username: string;

  @Column({ type: 'integer', nullable: true })
  rol: number;

  @Column({ type: 'bool', default: true })
  isActive: boolean;

  @OneToMany(() => History, (history) => history.user)
  history: History;

  @OneToMany(() => Convert, (convert) => convert.user)
  convert: Convert;

  @BeforeInsert()
  @BeforeUpdate()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }
  validateRol() {
    if (this.rol !== ROL.executive && this.rol !== ROL.admin) {
      throw new Error('The value of "role" must be 1 or 2.');
    }
  }
}
