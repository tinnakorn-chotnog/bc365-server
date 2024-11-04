import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DistrictsBase } from './districts.base.type';

@ObjectType()
export class Districts extends DistrictsBase {
}
