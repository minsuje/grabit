import { Tab } from '@/components/Component0117';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { kr, ko } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Challenge } from '@/types/types';
import ChallengeDetail from './ChallengeDetail';

async function patchChallenge(challenge_id: string | undefined) {
    const result = await axios({
        method: 'PATCH',
        url: `http://43.201.22.60:3000/challengeEdit/${challenge_id}`,
        data: ChallengeDetail,
    });
    console.log(result);
}

async function deleteChallenge(challenge_id: string | undefined) {
    const result = await axios({
        method: 'DELETE',
        url: `http://43.201.22.60:3000/challengeEdit/${challenge_id}`,
    });
    console.log(result);
}

function ChallengeEdit({ className }: React.HTMLAttributes<HTMLDivElement>) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(2022, 0, 20),
        to: addDays(new Date(2022, 0, 20), 20),
    });

    const { challenge_id } = useParams();

    const [challengeDetail, setChallengeDetail] = useState<Challenge>({
        challenge_id: 1,
        userid_num: 1,
        challenge_name: '물마시기',
        topic: '건강',
        challenger_userid_num: [1, 2],
        goal_money: 1000,
        is_public: 'true',
        term: 3,
        winner_userid_num: null,
        authentication_start_date: '2024-01-24',
        authentication_end_date: '2024-02-01',
        authentication_start_time: 4,
        authentication_end_time: 5,
    });

    useEffect(() => {
        {
            axios
                .get(`http://43.201.22.60:3000/challengeDetail/${challenge_id}`)
                .then((response) => {
                    console.log(response.data);
                    setChallengeDetail(response.data[0]);
                })
                .catch((error) => {
                    console.error('ChallengeInProgress에서 진행중인챌린지 오류발생 :', error);
                });
        }
    }, []);

    return (
        <div className="container ">
            <h1 className="text-3xl font-bold py-4">챌린지 수정</h1>
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
            <Input
                value={challengeDetail.topic}
                onChange={(e) => {
                    setChallengeDetail((challengeDetail) => {
                        return { ...challengeDetail, topic: e.target.value };
                    });
                }}
            />

            <h2 className="text-xl font-bold py-4">기간</h2>
            <div className={cn('grid gap-2', className)}>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={'outline'}
                            className={cn(
                                'w-[300px] justify-start text-left font-normal',
                                !date && 'text-muted-foreground',
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, 'LLL dd, y', { locale: ko })} -{' '}
                                        {format(date.to, 'LLL dd, y', { locale: ko })}
                                    </>
                                ) : (
                                    format(date.from, 'LLL dd, y', { locale: ko })
                                )
                            ) : (
                                <span>날짜를 선택하세요</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                            locale={ko}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <h2 className="text-xl font-bold py-4">인증 주기</h2>
            <Select
                onValueChange={(value) => {
                    setChallengeDetail((challengeDetail) => {
                        return { ...challengeDetail, term: Number(value) };
                    });
                }}
            >
                <SelectTrigger className="w-[180px]">
                    {challengeDetail.term != 7 ? (
                        <SelectValue placeholder={'주 ' + challengeDetail.term + '일'} />
                    ) : (
                        <SelectValue placeholder="매일" />
                    )}
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="3">주 3회</SelectItem>
                    <SelectItem value="5">주 5회</SelectItem>
                    <SelectItem value="7">매일</SelectItem>
                </SelectContent>
            </Select>
            <div className="grid grid-cols-2">
                <h2 className="text-xl font-bold py-4">인증 시작 시간</h2>
                <h2 className="text-xl font-bold py-4">인증 마감 시간</h2>
                <Select
                    onValueChange={(value) => {
                        setChallengeDetail((challengeDetail) => {
                            return { ...challengeDetail, authentication_start_time: Number(value) };
                        });
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={challengeDetail.authentication_start_time + ':00'} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1:00</SelectItem>
                        <SelectItem value="2">2:00</SelectItem>
                        <SelectItem value="3">3:00</SelectItem>
                        <SelectItem value="4">4:00</SelectItem>
                        <SelectItem value="5">5:00</SelectItem>
                        <SelectItem value="6">6:00</SelectItem>
                        <SelectItem value="7">7:00</SelectItem>
                        <SelectItem value="8">8:00</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    onValueChange={(value) => {
                        setChallengeDetail((challengeDetail) => {
                            return { ...challengeDetail, authentication_end_time: Number(value) };
                        });
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={challengeDetail.authentication_end_time + ':00'} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1:00</SelectItem>
                        <SelectItem value="2">2:00</SelectItem>
                        <SelectItem value="3">3:00</SelectItem>
                        <SelectItem value="4">4:00</SelectItem>
                        <SelectItem value="5">5:00</SelectItem>
                        <SelectItem value="6">6:00</SelectItem>
                        <SelectItem value="7">7:00</SelectItem>
                        <SelectItem value="8">8:00</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button onClick={() => deleteChallenge(challenge_id)}>삭제</Button>
            <Button onClick={() => patchChallenge(challenge_id)}>수정</Button>
        </div>
    );
}

export default ChallengeEdit;
