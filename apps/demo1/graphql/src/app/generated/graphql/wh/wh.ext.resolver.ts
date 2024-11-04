import { Resolver } from "@nestjs/graphql";
import { WhResolver } from "./wh.resolver";
import { Wh } from "./wh.type";

@Resolver(() => Wh)
export class WhExtResolver extends WhResolver {    
}
