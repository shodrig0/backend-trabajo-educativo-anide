import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { RaceModule } from './game/race.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, RaceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
