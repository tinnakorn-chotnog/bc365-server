import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { CustGroupBase } from './cust-group.base.type';

@ObjectType()
export class CustGroup extends CustGroupBase {
}
