import {Controller, Get, Query, Res, Header} from "@nestjs/common";
import {ImageService} from "../services/image.service";

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
    // @Header('Access-Control-Allow-Origin', '*')
    // @Header('Access-Control-Allow-Methods', 'GET')
    @Header('Content-Type', 'image/jpeg')
    async getHello(@Query() query, @Res() res): Promise<string> {
        console.log('asd')
        const {url, h: heightImage, w: widthImage, fit, b: blur} = query;
        if (!url) {
            res.status(404).send('not found');
            return;
        }
        const resultImageStream = await this.imageService.getOptimizeImage(url, heightImage, widthImage, fit || 'cover', blur);
        if (!resultImageStream) {
            res.status(502).send('fail');
            return;
        }
        if (resultImageStream === 'not found image') {
            res.status(404).send('not found image');
            return;
        }
        res.send(resultImageStream);
    }
}
