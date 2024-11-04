import { Resolver } from "@nestjs/graphql";
import { ExpenseResolver } from "./expense.resolver";
import { Expense } from "./expense.type";

@Resolver(() => Expense)
export class ExpenseExtResolver extends ExpenseResolver {    
}
