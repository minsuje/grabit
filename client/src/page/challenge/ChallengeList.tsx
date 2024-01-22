import { ListComponent1 } from '@/components/ComponentSeong';
import { Link } from 'react-router-dom';
import { ListComponentWithButton, ListComponentWithPeriod } from '@/components/Component0117';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Challenge } from '@/types/types';

function ChallengeList() {
    const [ingMyChallenge, setIngMyChallenge] = useState<Challenge[]>([]);
    const [preMyChallenge, setPreMyChallenge] = useState<Challenge[]>([]);
    const [publicChallenge, setPublicChallenge] = useState<Challenge[]>([]);
    useEffect(() => {
        {
            axios
                .get('http://43.201.22.60:3000/challengeList')
                .then((response) => {
                    console.log(response.data);
                    setIngMyChallenge(response.data.ingMyChallenge);
                    setPreMyChallenge(response.data.preMyChallenge);
                    setPublicChallenge(response.data.prePublicChallenge);
                })
                .catch((error) => {
                    console.error('ChallengeList에서  오류발생 :', error);
                });
        }
    }, []);
    return (
        <div className="container">
            <h1>참여중인 챌린지</h1>
            {ingMyChallenge.map((challenge: Challenge) => {
                return (
                    <Link to={`/challengeInProgress/${challenge.challenge_id}`} className=" text-black no-underline">
                        <ListComponent1 challenge={challenge} />
                    </Link>
                );
            })}

            <h1>참가 예정 챌린지</h1>

            {preMyChallenge.map((challenge: Challenge) => {
                return (
                    <>
                        <ListComponentWithButton challenge={challenge} />
                    </>
                );
            })}

            <h1>열려있는 챌린지</h1>

            {publicChallenge.map((challenge: Challenge) => {
                return <ListComponentWithPeriod challenge={challenge} />;
            })}
        </div>
    );
}
export default ChallengeList;
