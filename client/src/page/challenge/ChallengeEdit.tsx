import { Label } from '@/components/ui/label';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';

import * as React from 'react';
import { addDays, format, differenceInDays, parseISO, addHours, isAfter } from 'date-fns';
import { kr, ko } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Challenge } from '@/types/types';

async function patchChallenge(
    challenge_id: string | undefined,
    challengeDetail: Challenge,
    startDay: Date | undefined,
    period: number,
) {
    startDay && addHours(startDay, 9);
    const challengeData = {
        ...challengeDetail,
        authentication_start_date: startDay && startDay,
        authentication_end_date: startDay && addDays(startDay, period),
    };
    console.log(startDay);
    console.log(typeof startDay);

    console.log('period', period);
    const result = await axios({
        method: 'PATCH',
        url: `http://43.201.22.60:3000/challengeEdit/${challenge_id}`,
        data: challengeData,
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
    const { challenge_id } = useParams();
    const [date, setDate] = useState<Date | undefined>();

    const [challengeDetail, setChallengeDetail] = useState<Challenge>({
        challenge_id: 1,
        userid_num: 1,
        challenge_name: '',
        topic: '',
        challenger_userid_num: [1, 2],
        goal_money: 1000,
        is_public: true,
        term: 3,
        winner_userid_num: null,
        authentication_start_date: new Date('2024-02-01'),
        authentication_end_date: new Date('2024-02-08'),
        authentication_start_time: 4,
        authentication_end_time: 5,
    });

    let period = differenceInDays(challengeDetail.authentication_end_date, challengeDetail.authentication_start_date);
    let periodChanged = period;

    const handleStartDate = (date: Date) => {
        setDate(date);
        if (addDays(date, 1) < new Date()) {
            alert('오늘 이전 날짜는 선택할 수 없습니다.');
            setDate(new Date());
        }
    };

    const hours: number[] = [];
    for (let i = 0; i < 24; i++) {
        hours.push(i);
    }

    useEffect(() => {
        {
            axios
                .get(`http://43.201.22.60:3000/challengeDetail/${challenge_id}`)
                .then((response) => {
                    console.log(response.data);
                    setChallengeDetail(response.data[0]);
                })
                .catch((error) => {
                    console.error('ChallengeEdit에서 오류발생 :', error);
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

            <h2 className="text-xl font-bold py-4">챌린지명</h2>
            <Input
                value={challengeDetail.challenge_name}
                onChange={(e) => {
                    setChallengeDetail((challengeDetail) => {
                        return { ...challengeDetail, challenge_name: e.target.value };
                    });
                }}
            />

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
            <Select
                value={period.toString()}
                onValueChange={(value) => {
                    periodChanged = Number(value);

                    setChallengeDetail((challengeDetail) => {
                        return {
                            ...challengeDetail,
                            authentication_end_date: addDays(challengeDetail.authentication_start_date, periodChanged),
                        };
                    });
                }}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={period != 3 ? period / 7 + '주' : period + '일'} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="3">3일</SelectItem>
                    <SelectItem value="7">1주</SelectItem>
                    <SelectItem value="14">2주</SelectItem>
                </SelectContent>
            </Select>

            <h2 className="text-xl font-bold py-4">시작 날짜</h2>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        className={cn(
                            'w-[280px] justify-start text-left font-normal',
                            !challengeDetail.authentication_start_date && 'text-muted-foreground',
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                            format(date, 'PPP EEE', { locale: ko })
                        ) : (
                            <span>{format(challengeDetail.authentication_start_date, 'PPP EEE', { locale: ko })}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={handleStartDate} initialFocus />
                </PopoverContent>
            </Popover>

            <h2 className="text-xl font-bold py-4">끝 날짜</h2>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        className={cn(
                            'w-[280px] justify-start text-left font-normal',
                            !challengeDetail.authentication_end_date && 'text-muted-foreground',
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />

                        {date ? (
                            format(addDays(date, period), 'PPP EEE', { locale: ko })
                        ) : (
                            <span>{format(challengeDetail.authentication_end_date, 'PPP EEE', { locale: ko })}</span>
                        )}
                    </Button>
                </PopoverTrigger>
            </Popover>

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
            <div className="authTime flex gap-8">
                <div className="startTime flex flex-col">
                    <h2 className="text-xl font-bold py-4">인증 시작 시간</h2>
                    <Select
                        value={challengeDetail.authentication_start_time.toString()}
                        onValueChange={(value) => {
                            if (Number(value) >= challengeDetail.authentication_end_time) {
                                alert('인증 마감 시간보다 빠르게 설정할 수 없습니다.');
                                setChallengeDetail((challengeDetail) => {
                                    return {
                                        ...challengeDetail,
                                        authentication_start_time: challengeDetail.authentication_end_time - 1,
                                    };
                                });
                            } else {
                                setChallengeDetail((challengeDetail) => {
                                    return { ...challengeDetail, authentication_start_time: Number(value) };
                                });
                            }
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={challengeDetail.authentication_start_time + '시'} />
                        </SelectTrigger>
                        <SelectContent>
                            {hours.map((hour, i) => {
                                return (
                                    <SelectItem key={i} value={hour.toString()}>
                                        {hour}시
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
                <div className="endTime flex flex-col">
                    <h2 className="text-xl font-bold py-4">인증 마감 시간</h2>
                    <Select
                        value={challengeDetail.authentication_end_time.toString()}
                        onValueChange={(value) => {
                            if (Number(value) <= challengeDetail.authentication_start_time) {
                                alert('인증 시작 시간보다 늦게 설정할 수 없습니다.');
                                setChallengeDetail((challengeDetail) => {
                                    return {
                                        ...challengeDetail,
                                        authentication_end_time: challengeDetail.authentication_start_time + 1,
                                    };
                                });
                            } else {
                                setChallengeDetail((challengeDetail) => {
                                    return { ...challengeDetail, authentication_end_time: Number(value) };
                                });
                            }
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={challengeDetail.authentication_end_time + '시'} />
                        </SelectTrigger>
                        <SelectContent>
                            {hours.map((hour, i) => {
                                return (
                                    <SelectItem key={i} value={hour.toString()}>
                                        {hour}시
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex flex-col mt-3 gap-3">
                <Button
                    className="bg-slate-100 text-black hover:bg-slate-200"
                    onClick={() => deleteChallenge(challenge_id)}
                >
                    삭제
                </Button>
                <Button onClick={() => patchChallenge(challenge_id, challengeDetail, date, period)}>수정</Button>
            </div>
        </div>
    );
}

export default ChallengeEdit;
