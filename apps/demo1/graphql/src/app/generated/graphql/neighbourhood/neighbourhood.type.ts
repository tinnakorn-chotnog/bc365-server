import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { NeighbourhoodBase } from './neighbourhood.base.type';

@ObjectType()
export class Neighbourhood extends NeighbourhoodBase {
}
