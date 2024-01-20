import { ListComponent1 } from '@/components/ComponentSeong';
import ChallengeData from '../../data/ChallengeData';
import { Link } from 'react-router-dom';
import { ListComponentWithButton } from '@/components/Component0117';
import axios from 'axios';
import { useEffect, useState } from 'react';

function ChallengeList() {
    const [challengeInProgress, setChallengeInProgress] = useState<any>([]);
    useEffect(() => {
        {
            axios
                .get('http://43.201.22.60:3000/challengeList')
                .then((response) => {
                    console.log(response);
                    setChallengeInProgress(response);
                })
                .catch((error) => {
                    console.error('ChallengeInProgress에서 진행중인챌린지 오류발생 :', error);
                });
        }
    }, []);
    return (
        <div className="container">
            <h1>참여중인 챌린지</h1>
            {challengeInProgress.map((challenge: any) => {
                return (
                    <Link to={`/challengeInProgress/${challenge.challenge_id}`} className=" text-black no-underline">
                        <ListComponent1 key={challenge.challenge_id} challenge={challenge} />
                    </Link>
                );
            })}

            <h1>참가 예정 챌린지</h1>

            {ChallengeData.map((challenge) => {
                return (
                    <>
                        <ListComponentWithButton key={challenge.challenge_id} challenge={challenge} />
                    </>
                );
            })}

            <h1>열려있는 챌린지</h1>
            {ChallengeData.map((challenge) => {
                return (
                    <Link to={`/challengeDetail/${challenge.challenge_id}`} className=" text-black no-underline">
                        <ListComponent1 key={challenge.challenge_id} challenge={challenge} />
                    </Link>
                );
            })}
        </div>
    );
}
export default ChallengeList;
