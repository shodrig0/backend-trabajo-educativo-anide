import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hola, este es el backend del proyecto educativo para ANIDE';
  }
}
