import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Client, Transport, ClientKafka } from '@nestjs/microservices';
import { Readable } from 'stream';
import { Response } from 'express';

@Controller()
export class AppController {

  // @Client({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       clientId: 'hero',
  //       brokers: ['localhost:9092'],
  //     }
  //   }
  // })
  // client: ClientKafka;

  constructor(
    private readonly appService: AppService,
  ) {}

  // async onModuleInit() {
  //   this.client.subscribeToResponseOf('hero.kill.dragon');
  //   await this.client.connect();
  // }

  @Get()
  async getData(@Req() req: Request, @Res() res: Response) {
      const pdfDoc = await this.appService.getData();
      res.set('Content-Type','application/pdf')
      // res.set('Content-disposition', 'attachment; filename=output.pdf');
      // const fileStream = Readable.from(base64Buffer);
      // fileStream.pipe(res);
      pdfDoc.pipe(res)
      pdfDoc.end();
  }

  @Get('hello')
  hello() {
    return 'hello, Tinnakorn'
  }

  // @Post('hello')
  // async helloKafka() {
  //   return this.client.send('hero.kill.dragon', { a: 1, b: 2})
  // }


}
