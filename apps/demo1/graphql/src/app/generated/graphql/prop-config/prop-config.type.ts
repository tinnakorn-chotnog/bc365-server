import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PropConfigBase } from './prop-config.base.type';

@ObjectType()
export class PropConfig extends PropConfigBase {
}
