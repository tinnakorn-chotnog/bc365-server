import { Resolver } from "@nestjs/graphql";
import { AssetResolver } from "./asset.resolver";
import { Asset } from "./asset.type";

@Resolver(() => Asset)
export class AssetExtResolver extends AssetResolver {    
}
