import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function startServer() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}

startServer();