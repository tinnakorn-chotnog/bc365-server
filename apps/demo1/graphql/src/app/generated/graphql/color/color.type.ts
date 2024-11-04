import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ColorBase } from './color.base.type';

@ObjectType()
export class Color extends ColorBase {
}
