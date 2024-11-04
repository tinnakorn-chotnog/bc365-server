import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { AssetBranchBase } from './asset-branch.base.type';

@ObjectType()
export class AssetBranch extends AssetBranchBase {
}
