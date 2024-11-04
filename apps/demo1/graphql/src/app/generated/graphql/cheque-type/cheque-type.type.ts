import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ChequeTypeBase } from './cheque-type.base.type';

@ObjectType()
export class ChequeType extends ChequeTypeBase {
}
