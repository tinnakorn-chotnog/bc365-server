import { Resolver } from "@nestjs/graphql";
import { WhSuResolver } from "./wh-su.resolver";
import { WhSu } from "./wh-su.type";

@Resolver(() => WhSu)
export class WhSuExtResolver extends WhSuResolver {    
}
