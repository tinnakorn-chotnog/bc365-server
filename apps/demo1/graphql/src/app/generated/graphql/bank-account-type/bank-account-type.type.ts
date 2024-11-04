import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { BankAccountTypeBase } from './bank-account-type.base.type';

@ObjectType()
export class BankAccountType extends BankAccountTypeBase {
}
