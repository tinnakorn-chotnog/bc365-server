import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ResvTypeBase } from './resv-type.base.type';

@ObjectType()
export class ResvType extends ResvTypeBase {
}
