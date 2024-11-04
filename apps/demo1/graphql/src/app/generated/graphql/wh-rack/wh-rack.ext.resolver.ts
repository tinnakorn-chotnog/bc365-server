import { Resolver } from "@nestjs/graphql";
import { WhRackResolver } from "./wh-rack.resolver";
import { WhRack } from "./wh-rack.type";

@Resolver(() => WhRack)
export class WhRackExtResolver extends WhRackResolver {    
}
