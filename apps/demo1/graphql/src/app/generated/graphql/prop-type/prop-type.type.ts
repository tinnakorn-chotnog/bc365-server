import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PropTypeBase } from './prop-type.base.type';

@ObjectType()
export class PropType extends PropTypeBase {
}
