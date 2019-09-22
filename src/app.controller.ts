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

  @Get('parse-six')
  parseSix(): any {
    return this.appService.parseSix();
  }

  @Get('parse-eight')
  parseEight(): any {
    return this.appService.parseEight();
  }

  @Get('get-word-alias')
  getWordAlias(): any {
    return this.appService.getWordAlias();
  }

  @Post('parse')
  @HttpCode(200)
  parseContent(@Body() createCatDto: CreateCatDto): any {
    return this.appService.parseContent(createCatDto.content);
  }
}
