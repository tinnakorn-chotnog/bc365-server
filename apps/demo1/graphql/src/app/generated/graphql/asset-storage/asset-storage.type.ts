import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { AssetStorageBase } from './asset-storage.base.type';

@ObjectType()
export class AssetStorage extends AssetStorageBase {
}
