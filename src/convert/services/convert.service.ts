import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { ClientService } from '../client/client.services';
import { UF, UFsResponse } from '../interfaces';

import { SeparateDate } from '../interfaces/separate-date.interface';

import { UtilsService } from '../../auth/services/utils.service';
import { AuthService } from '../../auth/services';
import { InjectRepository } from '@nestjs/typeorm';
import { Convert } from '../entities/convert.entity';
import { DataConvertDto } from '../dto/data-convert.dto';
import { User } from '../../auth/entities';
import { CreateUserDto } from '../../auth/dto';

@Injectable()
export class ConvertService {
  constructor(
    @InjectRepository(Convert)
    private readonly convertRepository: Repository<Convert>,
    private authService: AuthService,
    private clientService: ClientService,
    private readonly utilsService: UtilsService,
  ) {}

  async create(dataConvertDto: DataConvertDto, idUser: string): Promise<any> {
    const { date, quantity } = dataConvertDto;
    const dateSeparate = this.getDateSeparate(date);
    const user: User = await this.authService.findUserForId(idUser);
    const { UFs: valueUf }: UFsResponse = await this.clientService.findValueUF(
      dateSeparate,
    );

    const { valueCurrent, result } = this.calculateUfToClp(valueUf, quantity);

    const createConvertDto = {
      originAmount: quantity,
      dateConvert: `${dateSeparate.day}/${dateSeparate.month}/${dateSeparate.year}`,
      valueUF: valueCurrent,
      valueCLP: this.getFormattedNumber(result).toString(),
    };
    await this.createConvert(user, createConvertDto);
    return createConvertDto;
  }

  async getAllHistories(): Promise<any> {
    return this.utilsService.queryCreateConvert();
  }

  private getDateSeparate(date: string): SeparateDate {
    const dateFormat = new Date(date);
    return {
      day: dateFormat.getDate().toString(),
      month: (dateFormat.getMonth() + 1).toString(),
      year: dateFormat.getFullYear().toString(),
    };
  }

  private calculateUfToClp(valueUf: UF[], quantity: number): any {
    const [{ Valor: valueCurrent }] = valueUf;
    const convertDecimal = parseFloat(valueCurrent.replace(/[,.]/g, ''));

    return {
      result: (convertDecimal * quantity).toString(),
      valueCurrent,
    };
  }

  getFormattedNumber(numberString: string): string {
    const number = parseFloat(numberString) / 100;
    const formattedNumber = number.toLocaleString('es-CL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formattedNumber;
  }

  async createConvert(
    createUserDto: CreateUserDto,
    createConvertDto: any,
  ): Promise<void> {
    try {
      const convert = this.convertRepository.create({
        user: createUserDto,
        ...createConvertDto,
      });

      await this.convertRepository.save(convert);
    } catch (error) {
      this.utilsService.handleDBError(error);
    }
  }
}
