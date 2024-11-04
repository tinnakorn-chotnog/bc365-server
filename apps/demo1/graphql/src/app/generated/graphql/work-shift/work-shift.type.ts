import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { WorkShiftBase } from './work-shift.base.type';

@ObjectType()
export class WorkShift extends WorkShiftBase {
}
