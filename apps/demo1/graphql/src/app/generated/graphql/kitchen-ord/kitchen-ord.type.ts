import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { KitchenOrdBase } from './kitchen-ord.base.type';

@ObjectType()
export class KitchenOrd extends KitchenOrdBase {
}
