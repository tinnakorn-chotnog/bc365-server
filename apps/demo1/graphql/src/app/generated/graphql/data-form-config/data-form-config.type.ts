import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DataFormConfigBase } from './data-form-config.base.type';

@ObjectType()
export class DataFormConfig extends DataFormConfigBase {
}
