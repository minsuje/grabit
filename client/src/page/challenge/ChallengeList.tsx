import { HotChallenge, Ranking } from '@/components/Component0117';
import { ListComponent1 } from '@/components/ComponentSeong';
import { Button } from '@/components/ui/button';
import ChallengeData from '../../data/ChallengeData';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ChallengeList() {
    return (
        <div className="container">
            <h1>참여중인 챌린지</h1>
            {ChallengeData.map((challenge) => {
                return (
                    <Link to={`/challengeInProgress/${challenge.challenge_num}`}>
                        <ListComponent1 challenge={challenge} />
                    </Link>
                );
            })}

            <h1>참가 예정 챌린지</h1>

            {ChallengeData.map((challenge) => {
                return (
                    <Link to={`/challengeDetail/${challenge.challenge_num}`}>
                        <ListComponent1 challenge={challenge} />
                    </Link>
                );
            })}

            <h1>열려있는 챌린지</h1>
            {ChallengeData.map((challenge) => {
                return (
                    <Link to={`/challengeDetail/${challenge.challenge_num}`}>
                        <ListComponent1 challenge={challenge} />
                    </Link>
                );
            })}
        </div>
    );
}
export default ChallengeList;
