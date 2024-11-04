import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { CreditTermBase } from './credit-term.base.type';

@ObjectType()
export class CreditTerm extends CreditTermBase {
}
