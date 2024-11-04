import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PropServiceTypeBase } from './prop-service-type.base.type';

@ObjectType()
export class PropServiceType extends PropServiceTypeBase {
}
