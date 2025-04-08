import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Req,
	UseInterceptors,
	HttpException,
	HttpStatus,
	Query,
	DefaultValuePipe,
	ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { ApiBodyWithSingleFile } from '@/decorator/swagger-form-daata.decorator';
import { RequestWithUser } from '@/types/requests.type';
import MongooseClassSerializerInterceptor from '@/interceptors/mongoose-class-serializer.interceptor';
import { Category } from './schemas/category.schema';

@Controller('categories')
@ApiBearerAuth('token')
@ApiTags('categories')
@UseInterceptors(MongooseClassSerializerInterceptor(Category))
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@ApiOperation({
		summary: 'User create a new category',
		description: 'Creates a new category.',
	})
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				name: {
					type: 'string',
					example: 'Technology',
					description: 'Category name',
				},
				description: {
					type: 'string',
					example: 'All about technology',
					description: 'Category description',
				},
				subcategories: {
					type: 'array',
					description: 'List of subcategories',
					items: {
						type: 'object',
						properties: {
							name: {
								type: 'string',
								example: 'AI',
								description: 'Subcategory name',
							},
						},
					},
				},
				isActive: {
					type: 'boolean',
					example: true,
					description: 'Category status',
				},
			},
			required: ['name'], // Trường name là bắt buộc
		},
	})
	@ApiResponse({
		status: 201,
		description: 'Category created successfully',
		type: Category,
	})
	@ApiResponse({
		status: 400,
		description: 'Bad Request',
	})
	@Post()
	async create(
		@Body() createCategoryDto: CreateCategoryDto,
	): Promise<Category> {
		return this.categoriesService.create(createCategoryDto);
	}

	@Get()
	async findAll(
		@Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
		@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
	) {
		return this.categoriesService.findAll(
			{},
			{
				offset,
				limit,
			},
		);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.categoriesService.findOne(id);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update an existing category' })
	@ApiBody({
		type: UpdateCategoryDto,
		description: 'Request body for updating a category',
	})
	@ApiResponse({
		status: 200,
		description: 'The category has been successfully updated.',
		type: Category,
	})
	update(
		@Param('id') id: string,
		@Body() updateCategoryDto: UpdateCategoryDto,
	) {
		return this.categoriesService.update(id, updateCategoryDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.categoriesService.remove(id);
	}
}
