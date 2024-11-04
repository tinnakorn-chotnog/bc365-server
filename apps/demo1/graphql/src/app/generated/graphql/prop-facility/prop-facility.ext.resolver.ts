import { Resolver } from "@nestjs/graphql";
import { PropFacilityResolver } from "./prop-facility.resolver";
import { PropFacility } from "./prop-facility.type";

@Resolver(() => PropFacility)
export class PropFacilityExtResolver extends PropFacilityResolver {    
}
