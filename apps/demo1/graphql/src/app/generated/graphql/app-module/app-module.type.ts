import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { AppModuleBase } from './app-module.base.type';

@ObjectType()
export class AppModule extends AppModuleBase {
}
