import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { WhStorageBase } from './wh-storage.base.type';

@ObjectType()
export class WhStorage extends WhStorageBase {
}
