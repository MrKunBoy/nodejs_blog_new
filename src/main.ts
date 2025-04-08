import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
	BadRequestException,
	Logger,
	ValidationError,
	ValidationPipe,
} from '@nestjs/common';
import { configSwagger } from './configs/api-docs.config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ERRORS_DICTIONARY } from './constraints/error-dictionary.constraint';

async function bootstrap() {
	const logger = new Logger(bootstrap.name);
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	configSwagger(app);
	app.useStaticAssets(join(__dirname, './served'));
	const configService = app.get(ConfigService);
	app.setGlobalPrefix('api/v1', { exclude: [''] });
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			exceptionFactory: (errors: ValidationError[]) =>
				new BadRequestException({
					message: ERRORS_DICTIONARY.VALIDATION_ERROR,
					details: errors
						.map((error) => Object.values(error.constraints))
						.flat(),
				}),
		}),
	);

	//config cors
	app.enableCors({
		origin: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		preflightContinue: false,
		credentials: true,
	});

	await app.listen(configService.get('PORT'), () =>
		logger.log(`Application running on port ${configService.get('PORT')}`),
	);
}
bootstrap();
