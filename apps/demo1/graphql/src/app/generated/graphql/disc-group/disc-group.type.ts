import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DiscGroupBase } from './disc-group.base.type';

@ObjectType()
export class DiscGroup extends DiscGroupBase {
}
