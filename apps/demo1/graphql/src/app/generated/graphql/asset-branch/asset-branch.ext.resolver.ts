import { Resolver } from "@nestjs/graphql";
import { AssetBranchResolver } from "./asset-branch.resolver";
import { AssetBranch } from "./asset-branch.type";

@Resolver(() => AssetBranch)
export class AssetBranchExtResolver extends AssetBranchResolver {    
}
