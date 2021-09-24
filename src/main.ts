import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from "./app.module";

async function startServer() {
  const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter()
  );
  await app.enableCors({
    origin: function (origin, callback) {
      // if (!origin || whitelist.indexOf(origin) !== -1) {
      //   callback(null, true)
      // } else {
      //   callback(new Error('Not allowed by CORS'))
      // }
      callback(null, true)
    }
  })
  await app.listen(3000);
}

startServer();