import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { RestaMenuBase } from './resta-menu.base.type';

@ObjectType()
export class RestaMenu extends RestaMenuBase {
}
