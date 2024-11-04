import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PdLotBase } from './pd-lot.base.type';

@ObjectType()
export class PdLot extends PdLotBase {
}
