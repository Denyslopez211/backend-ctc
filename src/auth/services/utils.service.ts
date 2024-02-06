import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities';
import { UserHistoryDto } from '../dto/user-history.dto';
import { MESSAGE } from '../constants';

@Injectable()
export class UtilsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async queryHistoryUser(userId?: string): Promise<UserHistoryDto[]> {
    try {
      const queryBuilder = this.userRepository
        .createQueryBuilder('u')
        .select('u.username', 'username')
        .addSelect('u.isActive', 'isActive')
        .addSelect('hi.created_at', 'date')
        .addSelect('hi.description', 'description')
        .addSelect('COUNT(*) as tried')
        .innerJoin('history', 'hi', 'u.id = hi.userId')
        .groupBy('u.username, u.isActive, date, hi.description')
        .orderBy('username', 'DESC')
        .addOrderBy('date')
        .addOrderBy('tried', 'DESC');

      if (userId) {
        queryBuilder.where('u.id = :userId', { userId });
      }

      return queryBuilder.getRawMany();
    } catch (error) {
      this.handleDBError(error);
    }
  }

  public async queryCreateConvert(): Promise<any> {
    try {
      const queryBuilder = this.userRepository
        .createQueryBuilder('u')
        .select('u.username', 'username')
        .addSelect('u.rol', 'rol')
        .addSelect('co.created_at', 'date')
        .addSelect('co.originAmount', 'originAmount')
        .addSelect('co.dateConvert', 'dateConvert')
        .addSelect('co.valueUF', 'valueUF')
        .addSelect('co.valueCLP', 'valueCLP')
        .innerJoin('convert', 'co', 'u.id = co.userId')
        .groupBy(
          'u.username, u.rol, date, co.originAmount, co.dateConvert, co.valueUF, co.valueCLP',
        )
        .orderBy('date', 'DESC');

      return queryBuilder.getRawMany();
    } catch (error) {
      this.handleDBError(error);
    }
  }

  public handleDBError(error: any): never {
    console.log(error);
    throw new InternalServerErrorException(MESSAGE.checkLog);
  }
}
