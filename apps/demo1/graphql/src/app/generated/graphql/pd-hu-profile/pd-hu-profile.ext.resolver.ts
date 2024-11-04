import { Resolver } from "@nestjs/graphql";
import { PdHuProfileResolver } from "./pd-hu-profile.resolver";
import { PdHuProfile } from "./pd-hu-profile.type";

@Resolver(() => PdHuProfile)
export class PdHuProfileExtResolver extends PdHuProfileResolver {    
}
