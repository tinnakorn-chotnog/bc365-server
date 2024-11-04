import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PdSuProfileBase } from './pd-su-profile.base.type';

@ObjectType()
export class PdSuProfile extends PdSuProfileBase {
}
