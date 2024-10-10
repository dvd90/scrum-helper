import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  openAIKey?: string;
  jiraDomain?: string;
  jiraEmail?: string;
  jiraApiKey?: string;
  googleId?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}
