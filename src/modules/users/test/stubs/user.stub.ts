import { UserRole } from '@/modules/user-roles/schemas/user-role.schema';
import { GENDER, User } from '../../schemas/user.schema';

export const createUserStub = (): User => {
	return {
		_id: '643d0fb80a2f99f4151176c4',
		email: 'johndoe@example.com',
		first_name: 'John',
		last_name: 'Doe',
		password: 'strongestP@ssword',
		name: 'johndoe',
		gender: GENDER.MALE,
		role: 'admin' as unknown as UserRole,
		fullName: 'John Doe',
		isActive: true,
		stripe_customer_id: 'cus_1234567890',
		accountType: 'LOCAL',
		date_of_birth: new Date('1990-01-01'),
		image: 'johndoe.jpg',
	};
};
