import { Resolver } from "@nestjs/graphql";
import { PdSubcateResolver } from "./pd-subcate.resolver";
import { PdSubcate } from "./pd-subcate.type";

@Resolver(() => PdSubcate)
export class PdSubcateExtResolver extends PdSubcateResolver {    
}
