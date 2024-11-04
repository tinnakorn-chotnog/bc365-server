import { Resolver } from "@nestjs/graphql";
import { WhShelfResolver } from "./wh-shelf.resolver";
import { WhShelf } from "./wh-shelf.type";

@Resolver(() => WhShelf)
export class WhShelfExtResolver extends WhShelfResolver {    
}
