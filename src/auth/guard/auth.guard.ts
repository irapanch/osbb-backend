// guard для перевірки авторизації користувача
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly usersService: UsersService) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (typeof request.session.userId === 'undefined') {
      throw new UnauthorizedException(
        'Ви не авторизовані. Будь ласка, увійдіть у систему, щоб отримати доступ.',
      );
    }
    const user = await this.usersService.findById(request.session.userId);
    request.user = user; // Додаємо користувача до запиту
    return true; // Доступ дозволено, якщо користувач знайдений
  }
}
