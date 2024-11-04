import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PdWhBase } from './pd-wh.base.type';

@ObjectType()
export class PdWh extends PdWhBase {
}
