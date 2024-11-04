import { Resolver } from "@nestjs/graphql";
import { PropUnitFacilityResolver } from "./prop-unit-facility.resolver";
import { PropUnitFacility } from "./prop-unit-facility.type";

@Resolver(() => PropUnitFacility)
export class PropUnitFacilityExtResolver extends PropUnitFacilityResolver {    
}
