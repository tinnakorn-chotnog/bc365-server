import { Resolver } from "@nestjs/graphql";
import { PdWhResolver } from "./pd-wh.resolver";
import { PdWh } from "./pd-wh.type";

@Resolver(() => PdWh)
export class PdWhExtResolver extends PdWhResolver {    
}
