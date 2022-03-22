import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { NextFunction, Request, Response } from 'express';
const UssdMenu = require('ussd-menu-builder');
let menu = new UssdMenu();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Post('ussd')
  async ussdHandler(@Req() req: Request, @Res() res: Response, next: NextFunction):Promise<any> {    
    return this.appService.ussdMenu(req, res, next);
  }

  

}
