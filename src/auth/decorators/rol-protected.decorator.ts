import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../enums/valid-roles';

export const META_ROLES = 'rol';

export const RolProtected = (...args: ValidRoles[]) => {
  return SetMetadata(META_ROLES, args);
};
