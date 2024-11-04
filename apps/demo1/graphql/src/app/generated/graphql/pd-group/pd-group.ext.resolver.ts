import { Resolver } from "@nestjs/graphql";
import { PdGroupResolver } from "./pd-group.resolver";
import { PdGroup } from "./pd-group.type";

@Resolver(() => PdGroup)
export class PdGroupExtResolver extends PdGroupResolver {    
}
