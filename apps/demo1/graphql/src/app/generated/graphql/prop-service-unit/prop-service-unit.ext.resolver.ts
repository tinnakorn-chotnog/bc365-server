import { Resolver } from "@nestjs/graphql";
import { PropServiceUnitResolver } from "./prop-service-unit.resolver";
import { PropServiceUnit } from "./prop-service-unit.type";

@Resolver(() => PropServiceUnit)
export class PropServiceUnitExtResolver extends PropServiceUnitResolver {    
}
