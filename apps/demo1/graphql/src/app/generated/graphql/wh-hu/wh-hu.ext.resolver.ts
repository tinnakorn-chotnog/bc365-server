import { Resolver } from "@nestjs/graphql";
import { WhHuResolver } from "./wh-hu.resolver";
import { WhHu } from "./wh-hu.type";

@Resolver(() => WhHu)
export class WhHuExtResolver extends WhHuResolver {    
}
