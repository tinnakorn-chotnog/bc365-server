/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { readFileSync } from 'fs';
import { HttpStatus, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { join } from 'path';

async function bootstrap() {

    let httpsOptions: any = null;
    if (process.env.SSL === 'true') {        
        const key = readFileSync(join(__dirname, 'cert/server.key'))
        const cert = readFileSync(join(__dirname, 'cert/star_korato24_com.crt'))
        const ca1Crt =  readFileSync(join(__dirname, 'cert/ChainCA1.crt'))
        const ca2Crt = readFileSync(join(__dirname, 'cert/ChainCA2.crt'))
        const rootCrt = readFileSync(join(__dirname, 'cert/RootCA.crt'))
        httpsOptions = {
            key: key,
            cert: cert,
            ca: [
                ca1Crt,
                ca2Crt,
                rootCrt,            
            ]
        };
    }

    const app = await NestFactory.create(AppModule, {
        httpsOptions,
    });

    app.enableCors();
    const globalPrefix = 'api';
    app.use(cookieParser());
    app.setGlobalPrefix(globalPrefix);
    const port = process.env.PORT || process.argv[2] || 8051;
    await app.listen(port);
    if (process.env.SSL === 'true') {        
        Logger.log(`🚀 Application is running https server at url ${port}/${globalPrefix}`)
    } else {
        Logger.log(`🚀 Application is running http server at url ${port}/${globalPrefix}`)
    }
}

bootstrap();