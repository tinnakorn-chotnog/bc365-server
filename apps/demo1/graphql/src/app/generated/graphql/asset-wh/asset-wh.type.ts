import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { AssetWhBase } from './asset-wh.base.type';

@ObjectType()
export class AssetWh extends AssetWhBase {
}
