import { IsNotEmpty, IsString, Matches } from 'class-validator';
export class LoginDto {
  @IsString({ message: 'Вкажіть номер телефону в форматі +380XXXXXXXXX' })
  @IsNotEmpty({
    message:
      'Вкажіть номер телефону в форматі +380XXXXXXXXX Поле не може бути порожнім',
  })
  @Matches(/^\+380\d{9}$/, {
    message: 'Невірний формат номера. Використовуйте формат +380XXXXXXXXX',
  })
  login: string;

  @IsString()
  @IsNotEmpty({ message: 'Вкажіть пароль.  Поле не може бути порожнім' })
  password: string;
}
