import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { AppNavGroupBase } from './app-nav-group.base.type';

@ObjectType()
export class AppNavGroup extends AppNavGroupBase {
}
