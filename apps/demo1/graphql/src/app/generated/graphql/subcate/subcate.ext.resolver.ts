import { Resolver } from "@nestjs/graphql";
import { SubcateResolver } from "./subcate.resolver";
import { Subcate } from "./subcate.type";

@Resolver(() => Subcate)
export class SubcateExtResolver extends SubcateResolver {    
}
