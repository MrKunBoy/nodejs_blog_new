import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPasswordHelper } from '@/helpers/utils';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import {
  ChangePassworđto,
  CheckCodeAuthDto,
  CreateAuthDto,
} from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly mailerService: MailerService,
  ) {}

  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email });
    if (user) return true;
    return false;
  };

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone, address, image } = createUserDto;

    //check if email already exist
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(`${email} already exists`);
    }

    //hash password
    const hashPassword = await hashPasswordHelper(password);
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      phone,
      address,
      image,
    });
    return { _id: user._id };
    // return user;
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;
    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select('-password')
      .sort(sort as any);
    return {
      results,
      meta: {
        current: current,
        pageSize: pageSize,
        total: totalItems,
        pages: totalPages,
      },
    };
  }

  async findOne(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return await this.userModel.findById(_id).select('-password');
    } else {
      throw new BadRequestException('Invalid ID');
    }
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email: email });
    if (user) return user;
    return null;
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }

  async remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return await this.userModel.deleteOne({ _id });
    } else {
      throw new BadRequestException('Invalid ID');
    }
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { name, email, password } = registerDto;

    //check if email already exist
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(`${email} already exists`);
    }

    //hash password
    const hashPassword = await hashPasswordHelper(password);
    const codeId = uuidv4();
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      isActive: false,
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes'), // manipulate
    });

    //send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Activate your account', // Subject line
      template: 'register.hbs',
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId,
      },
    });
    return { _id: user._id };
  }

  async handleActive(codeAuthDto: CheckCodeAuthDto) {
    const user = await this.userModel.findOne({
      _id: codeAuthDto._id,
      codeId: codeAuthDto.code,
    });
    if (!user) {
      throw new BadRequestException('Invalid activation code or expired');
    }

    //compare code
    const isCodeValid = dayjs().isBefore(user.codeExpired);
    if (!isCodeValid) {
      throw new BadRequestException('Invalid activation code or expired');
    } else {
      //update user
      await this.userModel.updateOne(
        { _id: codeAuthDto._id },
        { isActive: true, codeId: null, codeExpired: null },
      );
      return { isCodeValid };
    }
  }

  async retryActive(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Account not found');
    }
    if (user.isActive) {
      throw new BadRequestException('Account already active');
    }
    const codeId = uuidv4();
    //update data
    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes'), // manipulate
    });
    //re-send code
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Activate your account', // Subject line
      template: 'register.hbs',
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId,
      },
    });
    return { _id: user._id };
  }

  async retryPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Account not found');
    }

    const codeId = uuidv4();
    //update data
    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes'), // manipulate
    });
    //re-send code
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Change your password', // Subject line
      template: 'register.hbs',
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId,
      },
    });
    return { _id: user._id, email: user.email };
  }

  async changePassword(data: ChangePassworđto) {
    if (data.confirmPassword !== data.password) {
      throw new BadRequestException('Passwords do not match');
    }
    //check email
    const user = await this.userModel.findOne({ email: data.email });
    if (!user) {
      throw new BadRequestException('Account not found change password');
    }

    //compare code
    const isCodeValid = dayjs().isBefore(user.codeExpired);
    if (!isCodeValid) {
      throw new BadRequestException('Invalid activation code or expired');
    } else {
      //update password
      const newPassword = await hashPasswordHelper(data.password);
      await user.updateOne({ password: newPassword });
      return { isCodeValid };
    }
  }
}
