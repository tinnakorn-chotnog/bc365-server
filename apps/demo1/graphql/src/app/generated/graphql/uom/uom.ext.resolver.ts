import { Resolver } from "@nestjs/graphql";
import { UomResolver } from "./uom.resolver";
import { Uom } from "./uom.type";

@Resolver(() => Uom)
export class UomExtResolver extends UomResolver {    
}
