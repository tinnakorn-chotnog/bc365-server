import { Resolver } from "@nestjs/graphql";
import { PdBalResolver } from "./pd-bal.resolver";
import { PdBal } from "./pd-bal.type";

@Resolver(() => PdBal)
export class PdBalExtResolver extends PdBalResolver {    
}
