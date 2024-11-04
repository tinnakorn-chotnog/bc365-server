import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { AppNavBase } from './app-nav.base.type';

@ObjectType()
export class AppNav extends AppNavBase {
}
