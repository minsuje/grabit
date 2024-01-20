import { Label } from '@/components/ui/label';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
}

const ChallengeDetailData = {
    challenge_id: 1,
    userid_num: 1,
    challenge_name: '무슨무슨 챌린지',
    topic: '건강',
    challenger_userid_num: [1, 2],
    goal_money: 1000,
    deadline: '2024-1-20',
    winner_userid_num: null,
    authentication_term: 2,
    authentication_time: '7:00 - 8:00',
};

function ChallengeDetail() {
    const { challenge_num } = useParams();
    const [challengeDetail, setChallengeDetail] = useState<any>('init');

    useEffect(() => {
        setChallengeDetail(ChallengeDetailData);

        // axios
        //     .post(`/challengeDetail/${challenge_num}`)
        //     .then((response): void => {
        //         console.log('response', response);
        //         setChallengeDetail(response);
        //     })
        //     .catch((error): void => {
        //         console.error('ChallengeDetail에서 axios 오류:', error);
        //         setChallengeDetail(ChallengeDetailData);
        //         console.log(challengeDetail);
        //     });
    }, []);

    return (
        <div className="container ">
            <h1 className="text-3xl font-bold py-4">챌린지 정보</h1>

            <div>
                <div className="user-list flex">
                    <h2 className="flex w-full text-xl font-bold py-4">참여자</h2>
                    <div className="flex w-fit items-center space-x-2">
                        <Label className="w-8">공개</Label>
                    </div>
                </div>

                <div className="user-list flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span>홍길동</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src="https://github.com/kwonkuwhi.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span>홍길동</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src="https://github.com/seejnn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span>홍길동</span>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold py-4">주제</h2>
            <div>{challengeDetail.topic}</div>

            <h2 className="text-xl font-bold py-4">기간</h2>
            <div>{challengeDetail.deadline}</div>

            <h2 className="text-xl font-bold py-4">인증 주기</h2>
            <div>{challengeDetail.authentication_term}</div>

            <h2 className="text-xl font-bold py-4">인증 시간</h2>
            <div>{challengeDetail.authentication_time}</div>

            <div className="user-list flex flex-col gap-4 pt-4">
                <Button>참가하기</Button>
            </div>
        </div>
    );
}

export default ChallengeDetail;
