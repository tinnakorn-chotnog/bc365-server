import { Resolver } from "@nestjs/graphql";
import { BankAccountResolver } from "./bank-account.resolver";
import { BankAccount } from "./bank-account.type";

@Resolver(() => BankAccount)
export class BankAccountExtResolver extends BankAccountResolver {    
}
