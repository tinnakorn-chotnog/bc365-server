import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PdBalBase } from './pd-bal.base.type';

@ObjectType()
export class PdBal extends PdBalBase {
}
