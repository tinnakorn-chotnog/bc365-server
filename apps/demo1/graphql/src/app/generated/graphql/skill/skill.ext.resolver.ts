import { Resolver } from "@nestjs/graphql";
import { SkillResolver } from "./skill.resolver";
import { Skill } from "./skill.type";

@Resolver(() => Skill)
export class SkillExtResolver extends SkillResolver {    
}
