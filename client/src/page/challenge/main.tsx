import { HotChallenge, Ranking } from '@/components/Component0117';
import { ListComponent1 } from '@/components/ComponentSeong';
import { Button } from '@/components/ui/button';
// import ChallengeData from '../../data/ChallengeData';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
interface Challenge {
    challenge_id: number;
    userid_num: number;
    challenge_name: string;
    topic: string;
    challenger_userid_num: number[] | null;
    goal_money: number;
    deadline: string;
    winner_userid_num: number | null;
    authentication_term: number;
    authentication_time: string;

    // 수정
}
interface DailyMission {
    mission_id: number;
    mission_content: string;
    success_userid_num?: number[] | null;
}

function Main() {
    const [challengeInProgress, setChallengeInProgress] = useState<any>([]);
    const [dailymission, setDailymission] = useState<any>([]);

    useEffect(() => {
        {
            axios
                .post('/challengeInProgress')
                .then((response) => {
                    console.log(response);
                    setChallengeInProgress(response);
                })
                .catch((error) => {
                    console.error('ChallengeInProgress에서 진행중인챌린지 오류발생 :', error);
                });
            axios
                .post('/dailymission')
                .then((response) => {
                    console.log(response);
                    setDailymission(response);
                })
                .catch((error) => {
                    console.error('ChallengeInProgress에서 일일미션 오류발생 :', error);
                });
        }
    }, []);

    return (
        <div className="container">
            <h1>랭킹</h1>
            <Ranking />
            <h1>오늘의 미션</h1>
            {dailymission.map((challenge: DailyMission) => {
                return (
                    <Link to={`/challengeInProgress/${challenge.mission_id}`}>
                        <ListComponent1 challenge={challenge} />
                    </Link>
                );
            })}

            <h1>진행중인 챌린지</h1>

            {challengeInProgress.map((challenge: Challenge) => {
                return (
                    <Link to={`/challengeInProgress/${challenge.challenge_id}`}>
                        <ListComponent1 challenge={challenge} />
                    </Link>
                );
            })}

            <h1>지금 인기있는 주제</h1>
            <HotChallenge />

            <div className="text-right p-3">
                <Link to="/challengeCreate">
                    <Button>챌린지 생성</Button>
                </Link>
            </div>
        </div>
    );
}
export default Main;
