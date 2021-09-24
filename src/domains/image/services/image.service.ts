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
            console.error(e);
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
                fit: fit === 'contain' ? sharp.fit.contain : sharp.fit.cover
            }).toBuffer()
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
            return await sharp(bufferImage).blur(scale).toBuffer();
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
     */
    async getOptimizeImage(url: string, height: string, width: string, fit: string, blurScale: number): Promise<stream> {
        try {
            let resultImageBuffer: Buffer = await ImageService.loadImage(url);
            if (!resultImageBuffer) {
                return null;
            }
            /**
             * если передан размер изображение то обрезаю его
             */
            if (!isNaN(Number(height)) && !isNaN(Number(width))) {
                const resizeImageBuffer = await ImageService.resizeImage(resultImageBuffer, Number(height), Number(width), fit);
                if (resizeImageBuffer) {
                    resultImageBuffer = resizeImageBuffer
                }
            }
            if (!isNaN(Number(blurScale)) && Number(blurScale > 0.3) && Number(blurScale <= 1000)) {
                const blurImageBuffer = await ImageService.blurImage(resultImageBuffer, Number(blurScale));
                if (blurImageBuffer) {
                    resultImageBuffer = blurImageBuffer
                }
            }
            // @ts-ignore
            // return `data:image/png;base64,${resultImageBuffer.toString('base64')}`;
            const stream = new Readable();
            stream.push(resultImageBuffer);
            return stream;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
}
