import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { BankAccountBase } from './bank-account.base.type';

@ObjectType()
export class BankAccount extends BankAccountBase {
}
