import { Controller, Get, Post, Param, Body, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';

export class CreateCatDto {
  readonly content: string;
}


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): any {
    return this.appService.getHello();
  }

  @Post('parse')
  @HttpCode(200)
  parseContent(@Body() createCatDto: CreateCatDto): any {
    return this.appService.parseContent(createCatDto.content);
  }
}
