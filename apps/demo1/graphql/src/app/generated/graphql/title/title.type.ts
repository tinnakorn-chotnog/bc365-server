import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { TitleBase } from './title.base.type';

@ObjectType()
export class Title extends TitleBase {
}
