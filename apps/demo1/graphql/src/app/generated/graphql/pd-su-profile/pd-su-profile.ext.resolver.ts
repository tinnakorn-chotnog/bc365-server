import { Resolver } from "@nestjs/graphql";
import { PdSuProfileResolver } from "./pd-su-profile.resolver";
import { PdSuProfile } from "./pd-su-profile.type";

@Resolver(() => PdSuProfile)
export class PdSuProfileExtResolver extends PdSuProfileResolver {    
}
