import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PropUnitBase } from './prop-unit.base.type';

@ObjectType()
export class PropUnit extends PropUnitBase {
}
