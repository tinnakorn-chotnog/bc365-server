import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PdAttributeBase } from './pd-attribute.base.type';

@ObjectType()
export class PdAttribute extends PdAttributeBase {
}
