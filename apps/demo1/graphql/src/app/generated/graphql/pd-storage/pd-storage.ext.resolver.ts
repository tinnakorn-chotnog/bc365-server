import { Resolver } from "@nestjs/graphql";
import { PdStorageResolver } from "./pd-storage.resolver";
import { PdStorage } from "./pd-storage.type";

@Resolver(() => PdStorage)
export class PdStorageExtResolver extends PdStorageResolver {    
}
