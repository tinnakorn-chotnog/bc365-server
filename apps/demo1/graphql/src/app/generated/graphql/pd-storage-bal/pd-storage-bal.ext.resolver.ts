import { Resolver } from "@nestjs/graphql";
import { PdStorageBalResolver } from "./pd-storage-bal.resolver";
import { PdStorageBal } from "./pd-storage-bal.type";

@Resolver(() => PdStorageBal)
export class PdStorageBalExtResolver extends PdStorageBalResolver {    
}
