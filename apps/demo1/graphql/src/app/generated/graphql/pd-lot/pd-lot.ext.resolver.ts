import { Resolver } from "@nestjs/graphql";
import { PdLotResolver } from "./pd-lot.resolver";
import { PdLot } from "./pd-lot.type";

@Resolver(() => PdLot)
export class PdLotExtResolver extends PdLotResolver {    
}
