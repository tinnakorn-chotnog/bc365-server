import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { UserBase } from './user.base.type';

@ObjectType()
export class User extends UserBase {
}
