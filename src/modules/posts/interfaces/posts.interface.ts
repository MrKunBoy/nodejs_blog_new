import { BaseRepositoryInterface } from '@/repositories/base/base.interface.repository';
import { Posts } from '../schemas/post.schema';
import { UpdatePostDto } from '../dto/update-post.dto';

export type PostRepositoryInterface = BaseRepositoryInterface<Posts>;
