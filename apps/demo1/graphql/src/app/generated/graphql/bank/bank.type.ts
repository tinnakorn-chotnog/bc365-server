import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { BankBase } from './bank.base.type';

@ObjectType()
export class Bank extends BankBase {
}
