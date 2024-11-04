import { Resolver } from "@nestjs/graphql";
import { PropUnitTypeResolver } from "./prop-unit-type.resolver";
import { PropUnitType } from "./prop-unit-type.type";

@Resolver(() => PropUnitType)
export class PropUnitTypeExtResolver extends PropUnitTypeResolver {    
}
