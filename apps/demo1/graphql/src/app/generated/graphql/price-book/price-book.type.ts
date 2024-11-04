import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PriceBookBase } from './price-book.base.type';

@ObjectType()
export class PriceBook extends PriceBookBase {
}
