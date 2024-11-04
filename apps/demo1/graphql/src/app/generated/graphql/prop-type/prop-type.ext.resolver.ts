import { Resolver } from "@nestjs/graphql";
import { PropTypeResolver } from "./prop-type.resolver";
import { PropType } from "./prop-type.type";

@Resolver(() => PropType)
export class PropTypeExtResolver extends PropTypeResolver {    
}
