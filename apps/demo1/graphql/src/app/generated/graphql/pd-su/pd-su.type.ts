import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PdSuBase } from './pd-su.base.type';

@ObjectType()
export class PdSu extends PdSuBase {
}
