import { Resolver } from "@nestjs/graphql";
import { RestaOptionGroupResolver } from "./resta-option-group.resolver";
import { RestaOptionGroup } from "./resta-option-group.type";

@Resolver(() => RestaOptionGroup)
export class RestaOptionGroupExtResolver extends RestaOptionGroupResolver {    
}
