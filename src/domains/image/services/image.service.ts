import { Injectable } from "@nestjs/common";
import { sharp } from "sharp";
import axios from "axios";

/**
 * Сервис работы с изображением
 */
@Injectable()
export class ImageService {
  async getOptimizeImage(url: string, height: string, width: string): Promise<object> {
    try {
      if (!url) {
        return null;
      }
      const responseImage = await axios.get(url, { responseType: "arraybuffer" });
      const { data } = responseImage;
      console.log(data);
      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
