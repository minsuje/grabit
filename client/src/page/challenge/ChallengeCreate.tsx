import { Tab } from '@/components/Component0117';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useState } from 'react';
import { addDays, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';

function ChallengeCreate() {
    const [challengeName, setChallengeName] = useState<string>('');
    const [goalMoney, setGoalMoney] = useState<number>(0);
    const [date, setDate] = useState<Date>();
    const [term, setTerm] = useState<number>(0);

    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [topic, setTopic] = useState<string>('');
    const [authTerm, setAuthTerm] = useState<string>('');
    const [authStart, setAuthStart] = useState<string>('');
    const [authEnd, setAuthEnd] = useState<string>('');

    const hours: number[] = [];
    for (let i = 0; i < 24; i++) {
        hours.push(i);
    }

    // hours를 오전 오후로 나눠서 배열에 저장. 오전 12시 ~ 오후 12시까지 모든 시간을 저장
    const amHours: number[] = [];
    const pmHours: number[] = [];
    hours.forEach((hour) => {
        if (hour < 12) {
            amHours.push(hour);
        } else {
            pmHours.push(hour);
        }
    });

    const tab1content = (
        <div>
            <div className="user-list flex">
                <h2 className="flex w-full text-xl font-bold py-4">참여자</h2>
                <div className="flex w-fit items-center space-x-2">
                    <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
                    <Label htmlFor="public" className="w-8">
                        공개
                    </Label>
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
                <Button>추가하기</Button>
            </div>
        </div>
    );

    const tab2content = (
        <div>
            <div className="user-list flex">
                <h2 className="flex w-full text-xl font-bold py-4">참여자</h2>
                <div className="flex w-fit items-center space-x-2">
                    <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
                    <Label htmlFor="public" className="w-8">
                        공개
                    </Label>
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
                <Button>추가하기</Button>
            </div>
        </div>
    );

    async function handleSubmit() {
        console.log('🚀 ~ handleSubmit ~ authEnd:', typeof authEnd);
        console.log('🚀 ~ handleSubmit ~ authStart:', typeof authStart);
        console.log('🚀 ~ handleSubmit ~ date:', typeof date);
        console.log('🚀 ~ handleSubmit ~ authTerm:', typeof authTerm);
        console.log('🚀 ~ handleSubmit ~ goalMoney:', typeof goalMoney);
        console.log('🚀 ~ handleSubmit ~ topic:', typeof topic);
        console.log('🚀 ~ handleSubmit ~ isPublic:', typeof isPublic);
        console.log('🚀 ~ handleSubmit ~ challengeName:', typeof challengeName);
        console.log('🚀 ~ handleSubmit ~ authEnd:', authEnd);
        console.log('🚀 ~ handleSubmit ~ authStart:', authStart);
        console.log('🚀 ~ handleSubmit ~ date:', date);
        console.log('🚀 ~ handleSubmit ~ authTerm:', authTerm);
        console.log('🚀 ~ handleSubmit ~ goalMoney:', goalMoney);
        console.log('🚀 ~ handleSubmit ~ topic:', topic);
        console.log('🚀 ~ handleSubmit ~ isPublic:', isPublic);
        console.log('🚀 ~ handleSubmit ~ challengeName:', challengeName);

        const result = await axios({
            method: 'POST',
            url: 'http://43.201.22.60:3000/challengeCreate',
            data: {
                challenge_name: challengeName,
                is_public: isPublic,
                topic,
                challenger_userid_num: [1, 2],
                goal_money: goalMoney,
                term: authTerm,
                authentication_start_date: date ? date : null,
                authentication_end_date: date ? addDays(date, term) : null,
                authentication_start_time: authStart,
                authentication_end_time: authEnd,
            },
        });
        console.log(result);
    }

    return (
        <div className="container ">
            <h1 className="text-3xl font-bold py-4">챌린지 생성</h1>
            <Tab tab1="1:1" tab2="그룹" tab1content={tab1content} tab2content={tab2content} />
            <h2 className="text-xl font-bold py-4">챌린지 이름</h2>
            <Input onChange={(e) => setChallengeName(e.target.value)} />
            <h2 className="text-xl font-bold py-4">주제</h2>
            <Input onChange={(e) => setTopic(e.target.value)} />
            <h2 className="text-xl font-bold py-4">목표 금액</h2>
            <Input type="number" onChange={(e) => setGoalMoney(Number(e.target.value))} />
            <h2 className="text-xl font-bold py-4">시작 날짜</h2>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        className={cn(
                            'w-[280px] justify-start text-left font-normal',
                            !date && 'text-muted-foreground',
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP EEE', { locale: ko }) : <span>날짜를 선택하세요</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
            </Popover>

            <h2 className="text-xl font-bold py-4">기간</h2>
            <Select onValueChange={(value) => setTerm(Number(value))}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="인증 주기" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1">2일</SelectItem>
                    <SelectItem value="2">3일</SelectItem>
                    <SelectItem value="4">5일</SelectItem>
                    <SelectItem value="6">일주일</SelectItem>
                </SelectContent>
            </Select>

            <h2 className="text-xl font-bold py-4">인증 주기</h2>
            <Select onValueChange={(value) => setAuthTerm(value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="인증 주기" />
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
                    <Select onValueChange={(value) => setAuthStart(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="인증 시간" />
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
                    <Select onValueChange={(value) => setAuthEnd(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="인증 시간" />
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
            <Button onClick={handleSubmit} className="w-full mt-12 mb-8">
                생성하기
            </Button>
        </div>
    );
}

export default ChallengeCreate;
