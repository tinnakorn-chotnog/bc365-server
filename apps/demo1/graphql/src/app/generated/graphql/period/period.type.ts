import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PeriodBase } from './period.base.type';

@ObjectType()
export class Period extends PeriodBase {
}
