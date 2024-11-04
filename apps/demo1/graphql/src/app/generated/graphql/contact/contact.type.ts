import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ContactBase } from './contact.base.type';

@ObjectType()
export class Contact extends ContactBase {
}
