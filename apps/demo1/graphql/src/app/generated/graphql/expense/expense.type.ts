import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ExpenseBase } from './expense.base.type';

@ObjectType()
export class Expense extends ExpenseBase {
}
