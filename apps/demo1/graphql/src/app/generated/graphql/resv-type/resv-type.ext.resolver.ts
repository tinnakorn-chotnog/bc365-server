import { Resolver } from "@nestjs/graphql";
import { ResvTypeResolver } from "./resv-type.resolver";
import { ResvType } from "./resv-type.type";

@Resolver(() => ResvType)
export class ResvTypeExtResolver extends ResvTypeResolver {    
}
