import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { UomBase } from './uom.base.type';

@ObjectType()
export class Uom extends UomBase {
}
