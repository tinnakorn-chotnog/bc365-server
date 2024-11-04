import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PdLotStorageBase } from './pd-lot-storage.base.type';

@ObjectType()
export class PdLotStorage extends PdLotStorageBase {
}
