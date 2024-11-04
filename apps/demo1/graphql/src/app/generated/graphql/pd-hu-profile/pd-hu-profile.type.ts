import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PdHuProfileBase } from './pd-hu-profile.base.type';

@ObjectType()
export class PdHuProfile extends PdHuProfileBase {
}
