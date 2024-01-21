import { HotChallenge, Ranking } from '@/components/Component0117';
import { ListComponent1 } from '@/components/ComponentSeong';
import { Button } from '@/components/ui/button';
import { Challenge } from '@/types/types';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

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
                .post('http://43.201.22.60:3000/challengeInProgress')
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
                        <ListComponent1 key={challenge.mission_id} challenge={challenge} />
                    </Link>
                );
            })}
            <h1>진행중인 챌린지</h1>
            {challengeInProgress.length == 0 ? (
                <div className="p-3 text-gray-700">
                    진행중인 챌린지가 없습니다. <br />
                    챌린지를 직접 생성하거나 다른 사람이 만든 챌린지에 참여해보세요
                    <Link to="/challengeList" className=" text-gray-400 no-underline">
                        <div className=" ">챌린지 보러가기</div>
                    </Link>
                </div>
            ) : (
                challengeInProgress.map((challenge: Challenge) => {
                    return (
                        <>
                            <Link to={`/challengeInProgress/${challenge.challenge_id}`}>
                                <ListComponent1 key={challenge.challenge_id} challenge={challenge} />
                            </Link>
                        </>
                    );
                })
            )}
            <h1>지금 인기있는 주제</h1>
            <HotChallenge />
            <Link to="/challengeList" className="text-center text-gray-400 no-underline">
                <div>전체 챌린지 보러가기</div>
            </Link>
            <div className="text-center p-3">
                <Link to="/challengeCreate">
                    <Button>챌린지 생성</Button>
                </Link>
            </div>
        </div>
    );
}
export default Main;
