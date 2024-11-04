import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { BranchBase } from './branch.base.type';

@ObjectType()
export class Branch extends BranchBase {
}
