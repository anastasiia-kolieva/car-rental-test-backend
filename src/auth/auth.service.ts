import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(
    email: string,
    password: string,
  ): Promise<{
    message: string;
    token?: string;
  }> {
    const existingUser = await this.usersService.findOne(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const newUser = await this.usersService.create(email, password);

    const payload = { email: newUser.email };
    const token = this.jwtService.sign(payload);

    return {
      message: 'User registered successfully',
      token,
    };
  }

  async logIn(email: string, password: string): Promise<{ token: string }> {
    const user = await this.usersService.findOne(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { email: user.email };
    const token = this.jwtService.sign(payload);
    return { token };
  }
}
