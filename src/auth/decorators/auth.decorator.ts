import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from 'src/schemas/user.schema';
import { Roles } from './roles.decorator';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/roles.guard';

export function Authorization(...roles: UserRole[]) {
  if (roles.length > 0) {
    return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
  }
  return applyDecorators(UseGuards(AuthGuard));
}
