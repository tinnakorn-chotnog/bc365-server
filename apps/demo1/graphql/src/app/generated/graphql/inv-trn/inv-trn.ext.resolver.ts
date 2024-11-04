import { Resolver } from "@nestjs/graphql";
import { InvTrnResolver } from "./inv-trn.resolver";
import { InvTrn } from "./inv-trn.type";

@Resolver(() => InvTrn)
export class InvTrnExtResolver extends InvTrnResolver {    
}
