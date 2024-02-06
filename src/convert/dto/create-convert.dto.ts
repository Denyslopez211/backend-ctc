import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateConvertDto {
  @ApiProperty({
    example: '27/02/2022',
    description: 'date',
  })
  @IsDate()
  date: Date;

  @ApiProperty({
    example: '1',
    description: 'quantity',
  })
  @IsNumber()
  quantity: number;
}
