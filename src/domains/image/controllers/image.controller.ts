import {Controller, Get, Query, Res, Header} from "@nestjs/common";
import {ImageService} from "../services/image.service";
import {Readable} from "stream";

@Controller("/optimize")
export class ImageController {
    constructor(private readonly imageService: ImageService) {
    }

    /**
     * Обработчик запроса на сжатие картинки
     * @param query
     * @param res
     */
    @Get()
    @Header('Access-Control-Allow-Origin', '*')
    @Header('Content-Type', 'image/jpeg')
    async getHello(@Query() query, @Res() res): Promise<string> {
        const {url, h: heightImage, w: widthImage, fit, b: blur} = query;
        if (!url) {
            res.status(404).send('not found');
            return;
        }
        const resultImageBuffer = await this.imageService.getOptimizeImage(url, heightImage, widthImage, fit || 'cover', blur);
        if (!resultImageBuffer) {
            res.status(502).send('fail');
            return;
        }
        if (resultImageBuffer === 'not found image') {
            res.status(404).send('not found image');
            return;
        }
        const stream = new Readable();
        stream.push(resultImageBuffer);
        stream.push(null);
        stream.pipe(res);
        // res.send(resultImageBuffer);
    }
}
