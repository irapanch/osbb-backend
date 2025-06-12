// guard для перевірки ролей користувача
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/schemas/user.schema';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    if (!roles) return true; // Якщо ролі не вказані, доступ дозволено
    if (!roles.includes(request.user.role)) {
      throw new ForbiddenException(
        `Недостатньо прав для доступу до цього ресурсу`,
      );
    }
    return true; // Якщо роль користувача відповідає одній з вказаних ролей, доступ дозволено
  }
}
