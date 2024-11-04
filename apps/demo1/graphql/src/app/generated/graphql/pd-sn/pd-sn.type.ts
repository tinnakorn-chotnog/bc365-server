import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PdSnBase } from './pd-sn.base.type';

@ObjectType()
export class PdSn extends PdSnBase {
}
