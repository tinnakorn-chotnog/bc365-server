import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PdResvBase } from './pd-resv.base.type';

@ObjectType()
export class PdResv extends PdResvBase {
}
