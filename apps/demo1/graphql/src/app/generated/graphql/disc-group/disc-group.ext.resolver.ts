import { Resolver } from "@nestjs/graphql";
import { DiscGroupResolver } from "./disc-group.resolver";
import { DiscGroup } from "./disc-group.type";

@Resolver(() => DiscGroup)
export class DiscGroupExtResolver extends DiscGroupResolver {    
}
