import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { CpdStorageBase } from './cpd-storage.base.type';

@ObjectType()
export class CpdStorage extends CpdStorageBase {
}
