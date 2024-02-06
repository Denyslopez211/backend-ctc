import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Auth, GetUser } from '../../auth/decorators';

import { ConvertService } from '../services/convert.service';
import { DataConvertDto } from '../dto/data-convert.dto';
import { UserRoleGuard } from '../../auth/guards/user-role';
import { User } from '../../auth/interfaces/user.interface';
import { RolProtected } from '../../auth/decorators/rol-protected.decorator';
import { ValidRoles } from '../../auth/enums/valid-roles';

@ApiTags('Convert')
@Controller('convert')
export class ConvertController {
  constructor(private readonly convertService: ConvertService) {}

  @Post('create')
  @Auth()
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'ok',
    // type: [UserHistoryDto],
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  createConvert(@Body() dataConvertDto: DataConvertDto, @GetUser() user: User) {
    return this.convertService.create(dataConvertDto, user.id);
  }

  @Get('all')
  @Auth()
  @ApiBearerAuth()
  @UseGuards(AuthGuard(), UserRoleGuard)
  @RolProtected(ValidRoles.admin)
  @ApiResponse({
    status: 200,
    description: 'ok',
    // type: [UserHistoryDto],
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getAllHistories() {
    return this.convertService.getAllHistories();
  }
}
