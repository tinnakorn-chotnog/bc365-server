import { Resolver } from "@nestjs/graphql";
import { SuTypeResolver } from "./su-type.resolver";
import { SuType } from "./su-type.type";

@Resolver(() => SuType)
export class SuTypeExtResolver extends SuTypeResolver {    
}
