import { Module } from '@nestjs/common';
import { ImageController } from "../controllers/image.controller";
import { ImageService } from "../services/image.service";
import { HeadersHelper } from "../../../helpers/headers.helper";

@Module({
  imports: [],
  controllers: [ImageController],
  providers: [ImageService, HeadersHelper],
})
export class ImageModule {}
