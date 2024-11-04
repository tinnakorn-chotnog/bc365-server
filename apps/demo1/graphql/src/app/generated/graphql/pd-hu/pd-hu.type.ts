import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PdHuBase } from './pd-hu.base.type';

@ObjectType()
export class PdHu extends PdHuBase {
}
