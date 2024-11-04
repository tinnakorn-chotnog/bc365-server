import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PdCostStackBase } from './pd-cost-stack.base.type';

@ObjectType()
export class PdCostStack extends PdCostStackBase {
}
