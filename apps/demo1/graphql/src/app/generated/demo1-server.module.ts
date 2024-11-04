import { Logger, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { extraProviders } from './demo1.provider';
import { Demo1Controller } from './demo1.controller';
import { Demo1Service } from './demo1.service';
import { Demo1ResolverModule } from './demo1-resolver.module';

const logger = new Logger();

const dbInitializeCheck: any = {}

@Module({
    imports: [
        Demo1ResolverModule,
        GraphQLModule.forRoot({
            driver: ApolloDriver,
            debug: true,
            path: 'graphql-demo1',
            playground: true,
            autoSchemaFile: join(process.cwd(), 'apps/demo1/schema.gql'),
            context: ({ req, res }) => {
				let bid: string;
                let brid: string;
				if (req.headers['secta']) {
					bid = req.headers['bid']
				} else {
					bid = req.cookies['crid'];
				}
                brid = req.headers['brid'];

                const useTrigger = process.env.USE_TRIGGER ? (process.env.USE_TRIGGER === 'true' ? true : false ) : false;

                return { req, res, useTrigger , keyspace: process.env.KEYSPACE, bid, brid }            }
        }),
	],
    controllers: [
        Demo1Controller
    ],
    providers: [
        Demo1Service,
        ...extraProviders
    ],
})
export class Demo1ServerModule {
}
