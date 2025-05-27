import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
  Validate,
} from 'class-validator';
import { IsPasswordsMatchingConstraint } from 'src/libs/common/decorators/is-passwords-matching-constraint';
import { AuthMethod, UserRole } from 'src/schemas/user.schema';

export class RegisterDto {
  @IsString({ message: 'Вкажіть номер телефону в форматі +380XXXXXXXXX' })
  @IsNotEmpty({
    message:
      'Вкажіть номер телефону в форматі +380XXXXXXXXX Поле не може бути порожнім',
  })
  @Matches(/^\+380\d{9}$/, {
    message: 'Невірний формат номера. Використовуйте формат +380XXXXXXXXX',
  })
  login: string;

  @IsNumber({}, { message: 'Поле має бути числом від 1 до 176' })
  @Min(1, { message: 'Ведіть номер Вашої квартири: від 1 до 176' })
  @Max(176, { message: 'Ведіть номер Вашої квартири: від 1 до 176' })
  number: number;

  @IsString()
  @IsNotEmpty({ message: 'Вкажіть пароль Поле не може бути порожнім' })
  password: string;
  @MinLength(6, {
    message:
      'Пароль має містити не менше 6 символів. Потурбуйтесь про безпечний пароль!',
  })
  @Validate(IsPasswordsMatchingConstraint, {
    message: 'Паролі не співпадають',
  })
  confirmPassword: string;

  //   @IsEnum(UserRole)
  //   @IsOptional()
  //   role?: UserRole = UserRole.REGULAR;

  //   @IsEnum(AuthMethod)
  //   @IsOptional()
  //   auth_method?: AuthMethod = AuthMethod.CREDENTIALS;
}
