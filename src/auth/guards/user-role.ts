import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { MESSAGE } from '../constants/index';
import { UserDto } from '../dto/user.dto';
import { META_ROLES } from '../decorators/rol-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRol: number = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );
    const valueRol = validRol[0];

    const req = context.switchToHttp().getRequest();
    const user = req.user as UserDto;

    if (!user) throw new InternalServerErrorException(MESSAGE.userNoFound);
    return valueRol === +user.rol;
  }
}
