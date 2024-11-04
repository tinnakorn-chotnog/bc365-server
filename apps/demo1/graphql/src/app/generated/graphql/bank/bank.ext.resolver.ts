import { Resolver } from "@nestjs/graphql";
import { BankResolver } from "./bank.resolver";
import { Bank } from "./bank.type";

@Resolver(() => Bank)
export class BankExtResolver extends BankResolver {    
}
