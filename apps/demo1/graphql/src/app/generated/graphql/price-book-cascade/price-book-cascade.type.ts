import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PriceBookCascadeBase } from './price-book-cascade.base.type';

@ObjectType()
export class PriceBookCascade extends PriceBookCascadeBase {
}
