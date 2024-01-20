import { Module } from '@nestjs/common';
import { ChallengeController } from './challenge.controller';
import { ChallengeService } from './challenge.service';
import { ChallengeCreateDto } from './dto/challenge-create.dto';

@Module({
  controllers: [ChallengeController],
  providers: [ChallengeService],
})
export class ChallengeModule {}

export interface Challenge {
  body: ChallengeCreateDto;
}
