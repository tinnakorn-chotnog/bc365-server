import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { RevenueBase } from './revenue.base.type';

@ObjectType()
export class Revenue extends RevenueBase {
}
