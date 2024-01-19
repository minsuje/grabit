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

function ChallengeEdit({ className }: React.HTMLAttributes<HTMLDivElement>) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(2022, 0, 20),
        to: addDays(new Date(2022, 0, 20), 20),
    });

    const tab1content = (
        <div>
            <div className="user-list flex">
                <h2 className="flex w-full text-xl font-bold py-4">참여자</h2>
                <div className="flex w-fit items-center space-x-2">
                    <Switch id="public" />
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
                    <Switch id="public" />
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

    return (
        <div className="container ">
            <h1 className="text-3xl font-bold py-4">챌린지 수정</h1>

            <Tab tab1="1:1" tab2="그룹" tab1content={tab1content} tab2content={tab2content} />

            <h2 className="text-xl font-bold py-4">주제</h2>
            <Input />

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
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="인증 주기" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="3">주 3회</SelectItem>
                    <SelectItem value="7">주 5회</SelectItem>
                    <SelectItem value="every">매일</SelectItem>
                </SelectContent>
            </Select>

            <h2 className="text-xl font-bold py-4">인증 시간</h2>
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="인증 시간" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="3">오전 7시</SelectItem>
                    <SelectItem value="7">주 5회</SelectItem>
                    <SelectItem value="every">매일</SelectItem>
                </SelectContent>
            </Select>
            <Button>삭제</Button>
            <Button>수정</Button>
        </div>
    );
}

export default ChallengeEdit;
