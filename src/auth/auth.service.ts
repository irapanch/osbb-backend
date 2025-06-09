import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { AuthMethod, User, UserRole } from './../schemas/user.schema';
import { UsersService } from './../users/users.service';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}
  public async register(req: Request, dto: RegisterDto) {
    const isExists = await this.usersService.findByLogin(dto.login, false);
    if (isExists) {
      throw new ConflictException(
        'Реєстрація не вдалася.Користувач з таким номером телефона вже існує.Введіть інший номер',
      );
    }
    const newUser = await this.usersService.create({
      userName: dto.userName,
      login: dto.login,
      password: dto.password,
      number: dto.number,
      auth_method: AuthMethod.CREDENTIALS,
      role: dto.role ?? UserRole.REGULAR,
    });
    return this.saveSession(req, newUser);
  }
  public async login(req: Request, dto: LoginDto) {
    const user = await this.usersService.findByLogin(dto.login, true, true);
    if (!user || !user.password) {
      throw new NotFoundException(
        'Користувач не знайдений або пароль невірний',
      );
    }
    const isPasswordValid = await verify(user.password, dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Пароль невірний. Спробуйте ще раз, або скористайтесь функцією відновлення паролю',
      );
    }
    return this.saveSession(req, user);
  }

  public async logout(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'Не вдалося завершити сесію користувача. Перевірте налаштування параметрів сесії.Можливо сесія вже була завершена, або виникли проблеми з сервером',
            ),
          );
        }
        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
        resolve();
      });
    });
  }

  private async saveSession(req: Request, user: User) {
    return new Promise((resolve, reject) => {
      req.session.userId = user._id;
      req.session.save((err) => {
        if (err) {
          return reject(
            new Error(
              'Не вдалося зберегти сесію користувача. Перевірте налаштування параметрів сесії',
            ),
          );
        }
        resolve({
          user,
        });
      });
    });
  }
}
