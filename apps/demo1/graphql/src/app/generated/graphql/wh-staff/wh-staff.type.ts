import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { WhStaffBase } from './wh-staff.base.type';

@ObjectType()
export class WhStaff extends WhStaffBase {
}
