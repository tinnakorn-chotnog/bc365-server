import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { AppMessageBase } from './app-message.base.type';

@ObjectType()
export class AppMessage extends AppMessageBase {
}
