import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { CustBase } from './cust.base.type';

@ObjectType()
export class Cust extends CustBase {
}
