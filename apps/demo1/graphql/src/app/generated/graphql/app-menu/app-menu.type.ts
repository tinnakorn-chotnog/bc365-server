import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { AppMenuBase } from './app-menu.base.type';

@ObjectType()
export class AppMenu extends AppMenuBase {
}
