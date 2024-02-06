import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class DataConvertDto {
  @ApiProperty({
    example: '27/02/2022',
    description: 'date',
  })
  @IsString()
  date: string;

  @ApiProperty({
    example: '1',
    description: 'quantity',
  })
  @IsNumber()
  quantity: number;
}
