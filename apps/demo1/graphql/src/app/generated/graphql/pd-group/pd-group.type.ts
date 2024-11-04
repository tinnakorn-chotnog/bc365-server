import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PdGroupBase } from './pd-group.base.type';

@ObjectType()
export class PdGroup extends PdGroupBase {
}
