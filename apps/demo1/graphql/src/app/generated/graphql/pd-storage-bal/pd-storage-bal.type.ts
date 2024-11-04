import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PdStorageBalBase } from './pd-storage-bal.base.type';

@ObjectType()
export class PdStorageBal extends PdStorageBalBase {
}
