import { Injectable } from "@nestjs/common";

interface Headers {
  host?: string;
  connection?: string;
  'cache-control'?: string;
  'sec-ch-ua'?: string;
  'sec-ch-ua-mobile'?: string;
  'sec-ch-ua-platform'?: string;
  'upgrade-insecure-requests'?: string;
  'user-agent'?: string;
  accept?: string;
  'sec-fetch-site'?: string;
  'sec-fetch-mode'?: string;
  'sec-fetch-user'?: string;
  'sec-fetch-dest'?: string;
  'accept-encoding'?: string;
  'accept-language'?: string;
  cookie?: string;
}

/**
 * Сервис работы с заголовками
 */
@Injectable()
export class HeadersHelper {
  /**
   * Метод обнаружения поддерживаемых типов контента
   * @param headers
   */
  acceptedTypesContent (headers: Headers): string[] {
    try {
      if (!headers) return null;
      const { accept } = headers;
      if (!accept) return null;
      return accept.split(',');
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  /**
   * Проверка на наличие определенного поддерживаемого типа контента
   * @param headers
   * @param value
   */
  checkTypeContent (headers: Headers, value: string): boolean {
    try {
      if (!headers) return null;
      const acceptedTypes = this.acceptedTypesContent(headers);
      if (!acceptedTypes) return null;
      for (const type of acceptedTypes) {
        if (type === value) return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
