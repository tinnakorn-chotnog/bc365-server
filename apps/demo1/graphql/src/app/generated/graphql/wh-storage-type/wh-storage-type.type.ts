import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { WhStorageTypeBase } from './wh-storage-type.base.type';

@ObjectType()
export class WhStorageType extends WhStorageTypeBase {
}
