import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';

const api_documentation_credentials = {
	name: 'admin',
	pass: 'admin',
};

export function configSwagger(app: INestApplication) {
	const config = new DocumentBuilder()
		.setTitle('Blog project')
		.setDescription('## The blog API description')
		.setVersion('1.0')
		.addSecurity('token', { type: 'http', scheme: 'bearer' })
		.addServer('/api/v1')
		.build();
	const document = SwaggerModule.createDocument(app, config);

	const http_adapter = app.getHttpAdapter();
	http_adapter.use(
		'/api/v1/api-docs',
		(req: Request, res: Response, next: NextFunction) => {
			function parseAuthHeader(input: string): { name: string; pass: string } {
				const [, encodedPart] = input.split(' ');

				const buff = Buffer.from(encodedPart, 'base64');
				const text = buff.toString('ascii');
				const [name, pass] = text.split(':');

				return { name, pass };
			}

			function unauthorizedResponse(): void {
				if (http_adapter.getType() === 'fastify') {
					res.statusCode = 401;
					res.setHeader('WWW-Authenticate', 'Basic');
				} else {
					res.status(401);
					res.set('WWW-Authenticate', 'Basic');
				}

				next();
			}

			if (!req.headers.authorization) {
				return unauthorizedResponse();
			}

			const credentials = parseAuthHeader(req.headers.authorization);

			if (
				credentials?.name !== api_documentation_credentials.name ||
				credentials?.pass !== api_documentation_credentials.pass
			) {
				return unauthorizedResponse();
			}

			next();
		},
	);
	SwaggerModule.setup('/api/v1/api-docs', app, document, {
		swaggerOptions: { persistAuthorization: true },
		customJs: '/swagger-custom.js',
		customSiteTitle: 'Blog NVT Documentation',
		customfavIcon: '/swagger.ico',
	});
}
