import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { SkillBase } from './skill.base.type';

@ObjectType()
export class Skill extends SkillBase {
}
