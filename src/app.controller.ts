import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly Prisma:PrismaService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("healthcheck")
  async healthCheck(){
    const result = await this.Prisma.vehicle.findFirst();

    return {
      dbStatus: result ? 'Connected and data found' : 'Connected but table empty',
    }
  }
}
