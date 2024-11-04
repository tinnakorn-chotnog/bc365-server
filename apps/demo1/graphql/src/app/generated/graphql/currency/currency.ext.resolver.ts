import { Resolver } from "@nestjs/graphql";
import { CurrencyResolver } from "./currency.resolver";
import { Currency } from "./currency.type";

@Resolver(() => Currency)
export class CurrencyExtResolver extends CurrencyResolver {    
}
