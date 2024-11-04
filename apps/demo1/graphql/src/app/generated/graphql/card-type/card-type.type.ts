import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { CardTypeBase } from './card-type.base.type';

@ObjectType()
export class CardType extends CardTypeBase {
}
