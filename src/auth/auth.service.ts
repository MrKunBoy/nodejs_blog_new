import { Injectable } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePasswordHelper } from '@/helpers/utils';
import { JwtService } from '@nestjs/jwt';
import {
  ChangePassworđto,
  CheckCodeAuthDto,
  CreateAuthDto,
} from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (!user) return null;
    const isVaidPassword = await comparePasswordHelper(pass, user.password);
    if (!isVaidPassword) return null;
    return user;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user._id };
    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async handleRegister(createAuthDto: CreateAuthDto) {
    return await this.usersService.handleRegister(createAuthDto);
  }

  async checkCode(codeAuthDto: CheckCodeAuthDto) {
    return await this.usersService.handleActive(codeAuthDto);
  }

  async retryActive(email: string) {
    return await this.usersService.retryActive(email);
  }

  async retryPassword(email: string) {
    return await this.usersService.retryPassword(email);
  }

  async changePassword(data: ChangePassworđto) {
    return await this.usersService.changePassword(data);
  }
}
