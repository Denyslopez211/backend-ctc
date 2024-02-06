import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { UFsResponse } from '../interfaces';
import { UtilsService } from '../../auth/services/utils.service';
import { SeparateDate } from '../interfaces/separate-date.interface';

@Injectable()
export class ClientService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  async findValueUF(separateDate: SeparateDate): Promise<UFsResponse> {
    const { day, month, year } = separateDate;
    const { data } = await firstValueFrom(
      this.httpService
        .get<UFsResponse>(
          `https://api.cmfchile.cl/api-sbifv3/recursos_api/uf/${year}/${month}/dias/${day}?apikey=${this.configService.get(
            'API_KEY',
          )}&formato=JSON`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.utilsService.handleDBError(error);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }
}
