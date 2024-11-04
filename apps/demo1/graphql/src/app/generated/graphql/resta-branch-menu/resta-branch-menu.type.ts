import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { RestaBranchMenuBase } from './resta-branch-menu.base.type';

@ObjectType()
export class RestaBranchMenu extends RestaBranchMenuBase {
}
