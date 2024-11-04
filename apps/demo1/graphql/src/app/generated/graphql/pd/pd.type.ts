import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PdBase } from './pd.base.type';

@ObjectType()
export class Pd extends PdBase {
}
