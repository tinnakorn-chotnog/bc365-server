import { Resolver } from "@nestjs/graphql";
import { CreditTermResolver } from "./credit-term.resolver";
import { CreditTerm } from "./credit-term.type";

@Resolver(() => CreditTerm)
export class CreditTermExtResolver extends CreditTermResolver {    
}
