import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PdTypeBase } from './pd-type.base.type';

@ObjectType()
export class PdType extends PdTypeBase {
}
