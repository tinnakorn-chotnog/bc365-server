import { Resolver } from "@nestjs/graphql";
import { TaxResolver } from "./tax.resolver";
import { Tax } from "./tax.type";

@Resolver(() => Tax)
export class TaxExtResolver extends TaxResolver {    
}
