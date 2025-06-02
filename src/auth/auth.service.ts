import { AuthMethod, User, UserRole } from './../schemas/user.schema';
import { UsersService } from './../users/users.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { Request } from 'express';

@Injectable()
export class AuthService {
  public constructor(private readonly usersService: UsersService) {}
  public async register(req: Request, dto: RegisterDto) {
    const isExists = await this.usersService.findByLogin(dto.login, false);
    if (isExists) {
      throw new ConflictException(
        'Реєстрація не вдалася.Користувач з таким номером телефона вже існує.Введіть інший номер',
      );
    }
    const newUser = await this.usersService.create({
      login: dto.login,
      password: dto.password,
      number: dto.number,
      auth_method: AuthMethod.CREDENTIALS,
      role: UserRole.REGULAR,
    });
    return this.saveSession(req, newUser);
  }
  public async login() {}
  public async logout() {}
  public async saveSession(req: Request, user: User) {
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
