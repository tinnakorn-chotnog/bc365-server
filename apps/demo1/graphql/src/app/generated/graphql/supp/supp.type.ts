import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { SuppBase } from './supp.base.type';

@ObjectType()
export class Supp extends SuppBase {
}
