import { Resolver } from "@nestjs/graphql";
import { WhEqmResolver } from "./wh-eqm.resolver";
import { WhEqm } from "./wh-eqm.type";

@Resolver(() => WhEqm)
export class WhEqmExtResolver extends WhEqmResolver {    
}
