import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { SdalBase } from './sdal.base.type';

@ObjectType()
export class Sdal extends SdalBase {
}
