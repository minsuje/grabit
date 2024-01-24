import { Label } from '@/components/ui/label';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Challenge } from '@/types/types';

function ChallengeAccept() {
    const { challenge_id } = useParams();
    const [challengeDetail, setChallengeDetail] = useState<Challenge>();

    useEffect(() => {
        console.log(challenge_id);
        axios
            .get(`http://43.201.22.60:3000/challengeDetail/${challenge_id}`)
            .then((response): void => {
                console.log('response', response.data);
                setChallengeDetail(response.data[0]);
            })
            .catch((error): void => {
                console.error('ChallengeDetail에서 axios 오류:', error);
            });
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
                </div>
            </div>

            <h2 className="text-xl font-bold py-4">주제</h2>
            <div>{challengeDetail != undefined && challengeDetail.topic}</div>

            <h2 className="text-xl font-bold py-4">기간</h2>
            <div>{challengeDetail != undefined && challengeDetail.term}</div>

            <h2 className="text-xl font-bold py-4">인증 주기</h2>
            <div>{challengeDetail != undefined && challengeDetail.term}</div>
            <div>{challengeDetail != undefined && challengeDetail.authentication_start_date.toString()}</div>

            <h2 className="text-xl font-bold py-4">인증 시간</h2>
            <div>
                {challengeDetail != undefined &&
                    challengeDetail.authentication_start_time + '-' + challengeDetail.authentication_end_time}
            </div>

            <div className="user-list flex flex-col gap-4 pt-4">
                <Button>참가하기</Button>
            </div>
        </div>
    );
}

export default ChallengeAccept;
