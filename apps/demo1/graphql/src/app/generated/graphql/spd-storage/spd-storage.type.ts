import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { SpdStorageBase } from './spd-storage.base.type';

@ObjectType()
export class SpdStorage extends SpdStorageBase {
}
