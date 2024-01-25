import { HotChallenge, Ranking } from '@/components/Component0117';
import { ListComponent1 } from '@/components/ComponentSeong';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Challenge, dailyMission } from '@/types/types';

export default function Main() {
    const [ingMyChallenge, setIngMyChallenge] = useState<Challenge[]>([]);
    const [dailymission, setDailymission] = useState<dailyMission>({
        mission_id: 1,
        mission_content: '물마시기',
        success_userid_num: [1, 2],
    });
    useEffect(() => {
        const queryCode = new URL(window.location.href).searchParams.get('code');
        if (queryCode) {
            sendAuthCodeToServer(queryCode);
            console.log('카카오 인가코드',queryCode);
        }
    }, []);
    const sendAuthCodeToServer = async (code) => {
        try {
            const response = await axios.post('http://localhost:3000/auth/kakao', { code });
            // 서버 응답 처리
            console.log(response.data);
        } catch (error) {
            console.error('서버 요청 실패:', error);
        }
    };

    return (
        <div className="container">
            <h1>랭킹</h1>

            <Ranking />
            <div>
                <button>로그아웃</button>
            </div>
            <h1>오늘의 미션</h1>

            <Link to={`/challengeDaily/${dailymission.mission_id}`} className="text-black no-underline">
                <div>
                    <div
                        key={dailymission.mission_id}
                        className="bg-gray-200 p-6 rounded-lg shadow-md flex flex-col mb-[5%]"
                    >
                        <div className="flex justify-between">
                            <p>{dailymission.mission_content}</p>

                            <p>N시간 남음</p>
                        </div>
                        <p>100P</p>
                    </div>
                </div>
            </Link>

            <h1>진행중인 챌린지</h1>
            {ingMyChallenge.length == 0 ? (
                <div className="p-3 text-gray-700">
                    진행중인 챌린지가 없습니다. <br />
                    챌린지를 직접 생성하거나 다른 사람이 만든 챌린지에 참여해보세요
                    <Link to="/challengeList" className=" text-gray-400 no-underline">
                        <div className=" ">챌린지 보러가기</div>
                    </Link>
                </div>
            ) : (
                ingMyChallenge.map((challenge: Challenge) => {
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
