import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PropServiceUnitBase } from './prop-service-unit.base.type';

@ObjectType()
export class PropServiceUnit extends PropServiceUnitBase {
}
