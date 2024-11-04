import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { UserTokenBase } from './user-token.base.type';

@ObjectType()
export class UserToken extends UserTokenBase {
}
