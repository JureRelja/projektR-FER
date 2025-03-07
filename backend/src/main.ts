import { NestApplication, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap(): Promise<void> {
    const app: NestApplication = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            enableDebugMessages: true,
            transform: true,
        }),
    );

    app.enableCors({
        origin: "*",
        methods: ["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH"],
        credentials: false,
    });

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
