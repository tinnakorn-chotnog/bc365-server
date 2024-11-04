import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { HuTypeBase } from './hu-type.base.type';

@ObjectType()
export class HuType extends HuTypeBase {
}
