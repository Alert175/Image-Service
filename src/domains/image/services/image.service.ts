import {Injectable} from "@nestjs/common";
import * as sharp from 'sharp';
import axios from "axios";

/**
 * Сервис работы с изображением
 */
@Injectable()
export class ImageService {
    /**
     * Внтуренний метод загрузки изображения
     * @param url
     */
    static async loadImage(url: string): Promise<string> {
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
                fit: fit === 'contain' ? sharp.fit.contain : sharp.fit.cover,
                background: {r: 0, g: 0, b: 0, alpha: 0}
            }).toBuffer()
            return resizedImage;
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Метод загрузки изображения
     * @param url
     * @param height
     * @param width
     * @param fit
     */
    async getOptimizeImage(url: string, height: string, width: string, fit: string): Promise<string> {
        try {
            const bufferImage = await ImageService.loadImage(url);
            if (!bufferImage) {
                return null;
            }
            if (!height || !width) {
                // @ts-ignore
                return `data:image/png;base64,${bufferImage.toString('base64')}`;
            }
            const resizeImage = await ImageService.resizeImage(bufferImage, 100, 100, fit)
            if (!resizeImage) {
                return null;
            }
            // @ts-ignore
            return `data:image/png;base64,${resizeImage.toString('base64')}`;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
}
