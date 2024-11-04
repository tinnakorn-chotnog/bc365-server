import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PdBranchBase } from './pd-branch.base.type';

@ObjectType()
export class PdBranch extends PdBranchBase {
}
