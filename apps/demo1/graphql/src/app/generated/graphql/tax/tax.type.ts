import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { TaxBase } from './tax.base.type';

@ObjectType()
export class Tax extends TaxBase {
}
