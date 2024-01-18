import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ListComponent1({ challenge }) {
    return (
        <div>
            <div className="bg-gray-200 p-6 rounded-lg shadow-md flex flex-col mb-[5%]">
                <div className="flex justify-between">
                    <p>{challenge.challengeName}</p>
                    <p>{challenge.day} 일 후 종료</p>
                </div>
                <p>{challenge.price} 원</p>
            </div>
        </div>
    );
}

export function ListComponent2() {
    return (
        <>
            <div className="bg-gray-200 p-6 rounded-lg justify-between shadow-md flex justify-content">
                <div className="">
                    <div className="text-black font-bold">물마시기</div>
                    <div className="text-black mt-2">15,000</div>
                </div>
                <div className="">
                    <div className="text-gray-400 ">2024.01.02~2024.01.03</div>
                    <div className="mt-2 text-end">승 </div>
                </div>
            </div>
        </>
    );
}

export function ListComponent3() {
    return (
        <>
            <div className="bg-gray-200 p-6 rounded-lg  shadow-md w-100">
                <div className="flex justify-between">
                    <div className="text-black font-bold">물마시기</div>
                    <div className="text-gray-400 ">2024.01.02~2024.01.03</div>
                </div>
                <div className="flex">
                    <div className="text-black mt-2 mr-3">15,000</div>
                    <div className="text-black mt-2">
                        <Badge variant="default">+1000원</Badge>
                    </div>
                </div>
                <div className="flex">
                    <div className="text-black mt-2 mr-3">1000P</div>
                    <div className="text-black mt-2">
                        <Badge variant="default">+100P</Badge>
                    </div>
                    <div className="flex justify-end w-[100%]">
                        <div className="text-black mt-2 ">승</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export function ProgressComponent() {
    return (
        <>
            <div className="flex justify-between mr-3">
                <div>진행률</div>
                <div className="mt-3">4/5</div>
            </div>
            <Progress value={75} />
        </>
    );
}

export function SelectComponent() {
    return (
        <>
            <Select>
                <div className="text-xl font-bold">주제</div>
                <div className="flex mt-3">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="건강" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">건강</SelectItem>
                        <SelectItem value="dark">취미</SelectItem>
                        <SelectItem value="system">학습</SelectItem>
                    </SelectContent>
                    <input type="text" className="border-solid border-2" />
                </div>
            </Select>
        </>
    );
}

export function SelectComponent2() {
    return (
        <>
            <Select>
                <div className="">
                    <div className="flex justify-between items-center">
                        <div className="flex justify-center align-center text-xl font-bold">기간</div>
                        <div>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="3일" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">3일</SelectItem>
                                <SelectItem value="dark">5일</SelectItem>
                                <SelectItem value="system">7일</SelectItem>
                            </SelectContent>
                        </div>
                    </div>
                    <div className="flex mt-3">
                        <div className="mr-10">시작</div>
                        <div className="text-gray-400">2024년 1월 22일</div>
                    </div>
                    <div className="flex mt-3 ">
                        <div className="mr-10">종료</div>
                        <div className=" text-gray-400">2024년 1월 25일</div>
                    </div>
                </div>
            </Select>
        </>
    );
}

export function CashComponent() {
    return (
        <>
            <div className="flex justify-between">
                <div>금액</div>
                <div className="text-gray-400">5000원</div>
            </div>
        </>
    );
}
export function TimeComponent() {
    return (
        <>
            <div>인증시간</div>
            <div className="mt-3 flex justify-between">
                <span>오전7시</span>
                <span>~</span>
                <span>오전8시</span>
            </div>
        </>
    );
}

// <div className="text-black flex mt-2">15000</div>
// <div className="">승 </div>
