
import { User } from '@/modules/users/schemas/user.schema';
import { Request } from 'express';

export interface RequestWithUser extends Request {
	user: User;
}