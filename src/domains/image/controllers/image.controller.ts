import { Controller, Get } from '@nestjs/common';
import { ImageService } from '../services/image.service';

@Controller("/optimize")
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  getHello(): string {
    return this.imageService.getHello();
  }
}
