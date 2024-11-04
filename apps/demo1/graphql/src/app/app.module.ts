import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Demo1ServerModule } from './generated/demo1-server.module';
import { RedisSequenceService } from 'libs/shared/src/lib/gql-adapter/redis/redis-sequence.service';
import { LangModule } from './translation/lang.module';
import { join } from 'path';
import { AuthModule } from '@bc365-server/auth';
import { S3FileuploadModule } from './fileupload/s3-fileupload.module';
import { PdfFontModule } from './font/pdf-font.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { configSchema } from '@bc365-server/common/config/config-schema'

const Joi = require('joi');
const webpath = join(__dirname, '../../../', 'client');
@Module({
    imports: [
        MailerModule.forRootAsync({
            // imports: [ConfigModule], // import module if not enabled globally
            useFactory: async (config: ConfigService) => {
                return {
                    // transport: config.get("MAIL_TRANSPORT"),
                    // or
                    transport: {
                        host: config.get('MAIL_HOST'),
                        port: 465,
                        secure: true,
                        auth: {
                            user: config.get('MAIL_USER'),
                            pass: config.get('MAIL_PASSWORD'),
                        },
                    },
                    defaults: {
                        from: `"Korato24" <${config.get('MAIL_FROM')}>`,
                    },
                    template: {
                        dir: join(__dirname, 'templates'),
                        adapter: new HandlebarsAdapter(),
                        options: {
                            strict: true,
                        },
                    },
                }
            },
            inject: [ConfigService],
        }),
        ConfigModule.forRoot({
            envFilePath: ['.env'],
            isGlobal: true,
            validationSchema: Joi.object(configSchema),
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'client'),
            exclude: [
                '/graphql-demo1/(.*)',
                '/api/(.*)']
        }),
        // RmqModule,
        AuthModule,
        Demo1ServerModule,
        LangModule,
        PdfFontModule,
        S3FileuploadModule,
    ],
    controllers: [AppController],
    providers: [
        AppService, RedisSequenceService
    ],
})
export class AppModule { }
