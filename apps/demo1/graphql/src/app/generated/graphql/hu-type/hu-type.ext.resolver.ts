import { Resolver } from "@nestjs/graphql";
import { HuTypeResolver } from "./hu-type.resolver";
import { HuType } from "./hu-type.type";

@Resolver(() => HuType)
export class HuTypeExtResolver extends HuTypeResolver {    
}
