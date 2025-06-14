import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from '../schemas/user.schema';
import { hash } from 'argon2';

@Injectable()
export class UsersService {
  public constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  public async findById(id: string): Promise<User> {
    const user = await this.userModel
      .findOne({ _id: new Types.ObjectId(id) })
      // .populate('accounts') // повертає всі поля з об'єкта accounts
      .exec();
    if (!user) {
      throw new NotFoundException(`Користувача з ID ${id} не знайдено`);
    }
    return user;
  }

  public async findByLogin(
    login: string,
    throwIfNotFound = true,
    includePassword = false,
  ): Promise<User | null> {
    if (!login) {
      throw new Error('Логін не може бути порожнім'); // Додаємо перевірку перед запитом
    }
    const query = this.userModel.findOne({ login });
    // .populate('accounts') // повертає всі поля з об'єкта accounts
    // .exec();
    if (includePassword) {
      query.select('+password'); // 👈 Додаємо поле password вручну
    }
    const user = await query.exec();
    if (!user && throwIfNotFound) {
      throw new NotFoundException(
        `Користувача з  логіном ${login} не знайдено`,
      );
    }
    return user; // або null, якщо не знайдено
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await hash(createUserDto.password);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword, // хешуємо пароль перед збереженням
    });
    return newUser.save(); // зберігаємо юзера в MongoDB
  }

  public async findAll(): Promise<User[]> {
    const result = await this.userModel
      .find({}) // вибираємо тільки потрібні поля
      .lean() // без обгортки Mongoose document
      .exec();
    console.log('👉 Users:', result.length); // краще логати довжину
    return result;
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true, // повертає вже оновлений документ
        runValidators: true, // перевірка схемою
      })
      // .populate('accounts') // повертає всі поля з об'єкта accounts
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Користувача не знайдено для оновлення');
    }

    return updatedUser;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Користувача не знайдено для видалення');
    }
    return { message: 'Користувача успішно видалено' };
  }

  // public async remove(id: string): Promise<void> {
  //   const result = await this.userModel.findByIdAndDelete(id).exec();
  //   if (!result) {
  //     throw new NotFoundException('Користувача не знайдено для видалення');
  //   }
  // }
}
