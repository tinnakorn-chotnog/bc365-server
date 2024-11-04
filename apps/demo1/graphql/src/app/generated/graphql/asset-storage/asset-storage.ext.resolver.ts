import { Resolver } from "@nestjs/graphql";
import { AssetStorageResolver } from "./asset-storage.resolver";
import { AssetStorage } from "./asset-storage.type";

@Resolver(() => AssetStorage)
export class AssetStorageExtResolver extends AssetStorageResolver {    
}
