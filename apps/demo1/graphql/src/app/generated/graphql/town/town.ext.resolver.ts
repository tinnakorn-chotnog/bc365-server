import { Resolver } from "@nestjs/graphql";
import { TownResolver } from "./town.resolver";
import { Town } from "./town.type";

@Resolver(() => Town)
export class TownExtResolver extends TownResolver {    
}
