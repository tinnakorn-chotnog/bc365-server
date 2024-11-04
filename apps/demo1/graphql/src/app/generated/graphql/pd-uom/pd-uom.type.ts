import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PdUomBase } from './pd-uom.base.type';

@ObjectType()
export class PdUom extends PdUomBase {
}
