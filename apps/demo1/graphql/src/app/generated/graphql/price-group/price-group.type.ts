import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PriceGroupBase } from './price-group.base.type';

@ObjectType()
export class PriceGroup extends PriceGroupBase {
}
