import { Resolver } from "@nestjs/graphql";
import { WhAisleResolver } from "./wh-aisle.resolver";
import { WhAisle } from "./wh-aisle.type";

@Resolver(() => WhAisle)
export class WhAisleExtResolver extends WhAisleResolver {    
}
