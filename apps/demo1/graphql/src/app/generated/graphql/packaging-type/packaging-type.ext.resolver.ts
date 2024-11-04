import { Resolver } from "@nestjs/graphql";
import { PackagingTypeResolver } from "./packaging-type.resolver";
import { PackagingType } from "./packaging-type.type";

@Resolver(() => PackagingType)
export class PackagingTypeExtResolver extends PackagingTypeResolver {    
}
