import { Resolver } from "@nestjs/graphql";
import { NeighbourhoodResolver } from "./neighbourhood.resolver";
import { Neighbourhood } from "./neighbourhood.type";

@Resolver(() => Neighbourhood)
export class NeighbourhoodExtResolver extends NeighbourhoodResolver {    
}
