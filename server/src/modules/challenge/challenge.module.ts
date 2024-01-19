import { Module } from '@nestjs/common';
import { ChallengeCreateController } from './challenge.controller';
import { ChallengeCreateService } from './challenge.service';
import { ChallengeCreateDto } from './dto/challenge-create.dto';

@Module({
  controllers: [ChallengeCreateController],
  providers: [ChallengeCreateService],
})
export class ChallengeModule {}

export interface Challenge {
  body: ChallengeCreateDto;
}
