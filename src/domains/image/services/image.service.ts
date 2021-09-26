import {Injectable} from "@nestjs/common";
import * as sharp from 'sharp';
import axios from "axios";
import { Readable } from 'stream';
import stream from "node:stream";

/**
 * Сервис работы с изображением
 */
@Injectable()
export class ImageService {
    /**
     * Внтуренний метод загрузки изображения
     * @param url
     */
    static async loadImage(url: string): Promise<Buffer> {
        try {
            if (!url) {
                return null;
            }
            const responseImage = await axios.get(url, {responseType: "arraybuffer"});
            const {data} = responseImage;
            return data;
        } catch (e) {
            console.error('fail load image');
            return null;
        }
    }
    /**
     * Статичный метод обрезания картинки
     * @param bufferImage
     * @param height
     * @param width
     * @param fit
     */
    static async resizeImage(bufferImage, height: number, width: number, fit: string) {
        try {
            const resizedImage = await sharp(bufferImage).resize({
                height,
                width,
                fit: fit === 'contain' ? sharp.fit.contain : sharp.fit.cover,
                background: 'rgba(0, 0, 0, 0)'
            }).png().toBuffer()
            return resizedImage;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    /**
     *  Статичный метод блюра изображения
     * @param bufferImage
     * @param scale
     */
    static async blurImage (bufferImage, scale: number) {
        try {
            return await sharp(bufferImage).blur(scale).png().toBuffer();
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    /**
     *  Статичный метод конфертации изображения в webp формат
     * @param bufferImage
     */
    static async convertToWebPImage (bufferImage) {
        try {
            return await sharp(bufferImage).webp().toBuffer();
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    /**
     * Метод загрузки изображения
     * @param url
     * @param height
     * @param width
     * @param fit
     * @param blurScale
     * @param isWebp
     */
    async getOptimizeImage(url: string, height: string, width: string, fit: string, blurScale: number, isWebp: boolean): Promise<Buffer | string> {
        try {
            let resultImageBuffer: Buffer = await ImageService.loadImage(url);
            if (!resultImageBuffer) return 'not found image';
            // если передан размер изображение то обрезаю его
            if (!isNaN(Number(height)) && !isNaN(Number(width))) {
                const resizeImageBuffer = await ImageService.resizeImage(resultImageBuffer, Number(height), Number(width), fit);
                if (resizeImageBuffer) resultImageBuffer = resizeImageBuffer;
            }
            // если передан данные для размытия, то картинка размывается
            if (!isNaN(Number(blurScale)) && Number(blurScale > 0.3) && Number(blurScale <= 1000)) {
                const blurImageBuffer = await ImageService.blurImage(resultImageBuffer, Number(blurScale));
                if (blurImageBuffer) resultImageBuffer = blurImageBuffer;
            }
            // если клиент поддерживает формат webp, то конвертирую в жанный формат
            if (isWebp) {
                const webpImageBuffer = await ImageService.convertToWebPImage(resultImageBuffer);
                if (webpImageBuffer) resultImageBuffer = webpImageBuffer;
            }
            return resultImageBuffer;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
}
