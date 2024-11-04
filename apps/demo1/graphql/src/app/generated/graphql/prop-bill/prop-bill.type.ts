import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PropBillBase } from './prop-bill.base.type';

@ObjectType()
export class PropBill extends PropBillBase {
}
