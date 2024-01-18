import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Register() {
    return (
        <>
            <div className="flex flex-col h-screen justify-center items-center ">
                <div className="border-solid border-2 border-gray-100 p-20">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="name">이름</Label>
                        <Input type="text" id="name" placeholder="이름" />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5  mt-10">
                        <Label htmlFor="username">아이디</Label>
                        <Input type="text" id="username" placeholder="아이디" />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5  mt-10">
                        <Label htmlFor="nickname">닉네임</Label>
                        <Input type="text" id="nickname" placeholder="닉네임" />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5  mt-10">
                        <Label htmlFor="profilePic">프로필 사진</Label>
                        <Input type="file" id="profilePic" placeholder="프로필 사진" />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5  mt-10">
                        <Label htmlFor="password">비밀번호</Label>
                        <Input type="password" id="password" placeholder="비밀번호" />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5  mt-10">
                        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                        <Input type="password" id="confirmPassword" placeholder="비밀번호 확인" />
                    </div>
                    <div className=" flex justify-center items-center">
                        <Link to="/login">
                            <Button variant="default" className="mt-20 ">
                                회원가입
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
