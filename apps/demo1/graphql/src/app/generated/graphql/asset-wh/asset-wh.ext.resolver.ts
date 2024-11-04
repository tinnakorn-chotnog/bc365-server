import { Resolver } from "@nestjs/graphql";
import { AssetWhResolver } from "./asset-wh.resolver";
import { AssetWh } from "./asset-wh.type";

@Resolver(() => AssetWh)
export class AssetWhExtResolver extends AssetWhResolver {    
}
