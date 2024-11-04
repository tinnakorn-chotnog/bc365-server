import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PropServiceItemBase } from './prop-service-item.base.type';

@ObjectType()
export class PropServiceItem extends PropServiceItemBase {
}
