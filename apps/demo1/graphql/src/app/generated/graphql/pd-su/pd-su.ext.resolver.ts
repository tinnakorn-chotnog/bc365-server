import { Resolver } from "@nestjs/graphql";
import { PdSuResolver } from "./pd-su.resolver";
import { PdSu } from "./pd-su.type";

@Resolver(() => PdSu)
export class PdSuExtResolver extends PdSuResolver {    
}
