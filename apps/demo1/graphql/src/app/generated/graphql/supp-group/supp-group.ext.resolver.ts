import { Resolver } from "@nestjs/graphql";
import { SuppGroupResolver } from "./supp-group.resolver";
import { SuppGroup } from "./supp-group.type";

@Resolver(() => SuppGroup)
export class SuppGroupExtResolver extends SuppGroupResolver {    
}
