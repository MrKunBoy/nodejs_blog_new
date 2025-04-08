import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';
import { CategoryRepository } from '@/repositories/categories.repository';
import { SlugPipe } from '@/pipes/slug.pipe';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Category.name, schema: CategorySchema },
		]),
	],
	controllers: [CategoriesController],
	providers: [
		CategoriesService,
		SlugPipe,
		{ provide: 'CategoryRepositoryInterface', useClass: CategoryRepository },
	],
	exports: [CategoriesService],
})
export class CategoriesModule {}
