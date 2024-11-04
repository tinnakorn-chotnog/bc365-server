import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { AssetBase } from './asset.base.type';

@ObjectType()
export class Asset extends AssetBase {
}
