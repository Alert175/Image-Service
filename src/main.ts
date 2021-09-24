import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";

async function startServer() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    // new FastifyAdapter(),
  );
  app.enableCors({origin: true, allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization'], methods: ['GET', 'PUT', 'OPTIONS', 'POST', 'DELETE']})
  await app.listen(3000);
}

startServer();