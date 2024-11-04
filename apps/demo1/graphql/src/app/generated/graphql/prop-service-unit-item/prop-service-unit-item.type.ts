import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PropServiceUnitItemBase } from './prop-service-unit-item.base.type';

@ObjectType()
export class PropServiceUnitItem extends PropServiceUnitItemBase {
}
