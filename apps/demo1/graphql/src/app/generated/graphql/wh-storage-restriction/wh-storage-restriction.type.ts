import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { WhStorageRestrictionBase } from './wh-storage-restriction.base.type';

@ObjectType()
export class WhStorageRestriction extends WhStorageRestrictionBase {
}
