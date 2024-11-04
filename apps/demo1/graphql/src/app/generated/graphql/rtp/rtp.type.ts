import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { RtpBase } from './rtp.base.type';

@ObjectType()
export class Rtp extends RtpBase {
}
