import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PosDeviceBase } from './pos-device.base.type';

@ObjectType()
export class PosDevice extends PosDeviceBase {
}
