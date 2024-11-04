import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ChequeReceivedBase } from './cheque-received.base.type';

@ObjectType()
export class ChequeReceived extends ChequeReceivedBase {
}
