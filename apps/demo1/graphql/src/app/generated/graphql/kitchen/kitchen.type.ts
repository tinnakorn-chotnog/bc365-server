import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { KitchenBase } from './kitchen.base.type';

@ObjectType()
export class Kitchen extends KitchenBase {
}
