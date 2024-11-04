import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PriceBookItemBase } from './price-book-item.base.type';

@ObjectType()
export class PriceBookItem extends PriceBookItemBase {
}
