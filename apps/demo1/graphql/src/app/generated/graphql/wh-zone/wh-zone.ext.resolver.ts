import { Resolver } from "@nestjs/graphql";
import { WhZoneResolver } from "./wh-zone.resolver";
import { WhZone } from "./wh-zone.type";

@Resolver(() => WhZone)
export class WhZoneExtResolver extends WhZoneResolver {    
}
