// import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { UsersService } from 'src/users/users.service';

// @Module({
//   controllers: [AuthController],
//   providers: [AuthService, UsersService],
// })
// export class AuthModule {}
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module'; // ✅ Імпортуй UsersModule

@Module({
  imports: [UsersModule], // ✅ правильна залежність
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
