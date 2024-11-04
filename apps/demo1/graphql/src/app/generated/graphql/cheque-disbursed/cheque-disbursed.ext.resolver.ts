import { Resolver } from "@nestjs/graphql";
import { ChequeDisbursedResolver } from "./cheque-disbursed.resolver";
import { ChequeDisbursed } from "./cheque-disbursed.type";

@Resolver(() => ChequeDisbursed)
export class ChequeDisbursedExtResolver extends ChequeDisbursedResolver {    
}
