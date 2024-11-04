import { Resolver } from "@nestjs/graphql";
import { PdTypeResolver } from "./pd-type.resolver";
import { PdType } from "./pd-type.type";

@Resolver(() => PdType)
export class PdTypeExtResolver extends PdTypeResolver {    
}
