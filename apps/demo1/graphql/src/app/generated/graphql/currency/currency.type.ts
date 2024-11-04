import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { CurrencyBase } from './currency.base.type';

@ObjectType()
export class Currency extends CurrencyBase {
}
