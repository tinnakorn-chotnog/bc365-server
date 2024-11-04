import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PdSubcateBase } from './pd-subcate.base.type';

@ObjectType()
export class PdSubcate extends PdSubcateBase {
}
