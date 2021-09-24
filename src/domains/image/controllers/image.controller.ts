import { Controller, Get, Query, HttpStatus, Res } from "@nestjs/common";
import { ImageService } from "../services/image.service";

@Controller("/optimize")
export class ImageController {
  constructor(private readonly imageService: ImageService) {
  }

  @Get()
  async getHello(@Query() query, @Res() res): Promise<string> {
    const {url, h: heightImage, w: widthImage, fit} = query;
    if (!url) {
      res.status(404).send('not found');
      return;
    }
    const resultImage = await this.imageService.getOptimizeImage(url, heightImage, widthImage, fit || 'cover');
    res.type('image/jpg').send(resultImage);
  }
}
