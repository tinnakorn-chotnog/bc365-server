import { Resolver } from "@nestjs/graphql";
import { PdLotStorageResolver } from "./pd-lot-storage.resolver";
import { PdLotStorage } from "./pd-lot-storage.type";

@Resolver(() => PdLotStorage)
export class PdLotStorageExtResolver extends PdLotStorageResolver {    
}
