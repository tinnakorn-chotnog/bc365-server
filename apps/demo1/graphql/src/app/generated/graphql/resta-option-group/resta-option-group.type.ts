import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { RestaOptionGroupBase } from './resta-option-group.base.type';

@ObjectType()
export class RestaOptionGroup extends RestaOptionGroupBase {
}
