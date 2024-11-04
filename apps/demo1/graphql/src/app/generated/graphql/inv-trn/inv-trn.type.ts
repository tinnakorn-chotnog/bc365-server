import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { InvTrnBase } from './inv-trn.base.type';

@ObjectType()
export class InvTrn extends InvTrnBase {
}
