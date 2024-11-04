import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { SalesChannelBase } from './sales-channel.base.type';

@ObjectType()
export class SalesChannel extends SalesChannelBase {
}
