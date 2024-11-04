import { Resolver } from "@nestjs/graphql";
import { PdResvResolver } from "./pd-resv.resolver";
import { PdResv } from "./pd-resv.type";

@Resolver(() => PdResv)
export class PdResvExtResolver extends PdResvResolver {    
}
