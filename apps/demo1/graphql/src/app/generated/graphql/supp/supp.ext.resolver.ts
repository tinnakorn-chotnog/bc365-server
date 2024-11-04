import { Resolver } from "@nestjs/graphql";
import { SuppResolver } from "./supp.resolver";
import { Supp } from "./supp.type";

@Resolver(() => Supp)
export class SuppExtResolver extends SuppResolver {    
}
