import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { CpdBase } from './cpd.base.type';

@ObjectType()
export class Cpd extends CpdBase {
}
