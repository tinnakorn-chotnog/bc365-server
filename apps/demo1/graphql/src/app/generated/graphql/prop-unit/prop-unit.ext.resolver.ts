import { Resolver } from "@nestjs/graphql";
import { PropUnitResolver } from "./prop-unit.resolver";
import { PropUnit } from "./prop-unit.type";

@Resolver(() => PropUnit)
export class PropUnitExtResolver extends PropUnitResolver {    
}
