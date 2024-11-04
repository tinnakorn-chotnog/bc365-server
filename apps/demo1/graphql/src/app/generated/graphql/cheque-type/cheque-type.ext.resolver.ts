import { Resolver } from "@nestjs/graphql";
import { ChequeTypeResolver } from "./cheque-type.resolver";
import { ChequeType } from "./cheque-type.type";

@Resolver(() => ChequeType)
export class ChequeTypeExtResolver extends ChequeTypeResolver {    
}
