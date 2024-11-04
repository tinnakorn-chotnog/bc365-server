import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocPackSuBase } from './doc-pack-su.base.type';

@ObjectType()
export class DocPackSu extends DocPackSuBase {
}
