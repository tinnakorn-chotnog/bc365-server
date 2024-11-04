import { Resolver } from "@nestjs/graphql";
import { PdSnResolver } from "./pd-sn.resolver";
import { PdSn } from "./pd-sn.type";

@Resolver(() => PdSn)
export class PdSnExtResolver extends PdSnResolver {    
}
