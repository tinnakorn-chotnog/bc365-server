import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ChequeDisbursedBase } from './cheque-disbursed.base.type';

@ObjectType()
export class ChequeDisbursed extends ChequeDisbursedBase {
}
