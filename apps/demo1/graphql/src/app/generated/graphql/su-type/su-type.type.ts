import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { SuTypeBase } from './su-type.base.type';

@ObjectType()
export class SuType extends SuTypeBase {
}
