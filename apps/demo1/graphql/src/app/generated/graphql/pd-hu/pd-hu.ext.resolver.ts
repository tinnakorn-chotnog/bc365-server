import { Resolver } from "@nestjs/graphql";
import { PdHuResolver } from "./pd-hu.resolver";
import { PdHu } from "./pd-hu.type";

@Resolver(() => PdHu)
export class PdHuExtResolver extends PdHuResolver {    
}
