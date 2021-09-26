import { Controller, Get, Query, Res, Req, Header } from "@nestjs/common";
import { ImageService } from "../services/image.service";
import { Readable } from "stream";
import { HeadersHelper } from "../../../helpers/headers.helper";

@Controller("/optimize")
export class ImageController {
  constructor(private readonly imageService: ImageService, private readonly headerHelper: HeadersHelper) {
  }

  /**
   * Обработчик запроса на сжатие картинки
   * @param query
   * @param req
   * @param res
   */
  @Get()
  @Header("Access-Control-Allow-Origin", "*")
  @Header("Content-Type", "image/png")
  async getHello(@Query() query, @Req() req, @Res() res): Promise<string> {
    const { url, h: heightImage, w: widthImage, fit, b: blur } = query;
    if (!url) {
      res.status(404).send("not found");
      return;
    }
    const isAllowedWebp = this.headerHelper.checkTypeContent(req.headers, "image/webp");
    const resultImageBuffer = await this.imageService.getOptimizeImage(url, heightImage, widthImage, fit || "cover", blur, isAllowedWebp === true);
    if (!resultImageBuffer) {
      res.status(502).send("fail");
      return;
    }
    if (resultImageBuffer === "not found image") {
      res.status(404).send("not found image");
      return;
    }
    const stream = new Readable();
    stream.push(resultImageBuffer);
    stream.push(null);
    stream.pipe(res);
  }
}
