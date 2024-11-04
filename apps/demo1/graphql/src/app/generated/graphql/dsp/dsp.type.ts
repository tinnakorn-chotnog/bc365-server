import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DspBase } from './dsp.base.type';

@ObjectType()
export class Dsp extends DspBase {
}
