import { Resolver } from "@nestjs/graphql";
import { PdUomResolver } from "./pd-uom.resolver";
import { PdUom } from "./pd-uom.type";

@Resolver(() => PdUom)
export class PdUomExtResolver extends PdUomResolver {    
}
