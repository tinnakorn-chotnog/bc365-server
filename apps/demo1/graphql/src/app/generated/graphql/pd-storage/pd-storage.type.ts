import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PdStorageBase } from './pd-storage.base.type';

@ObjectType()
export class PdStorage extends PdStorageBase {
}
