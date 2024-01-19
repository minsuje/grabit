import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Login() {
    return (
        <>
            <div className="grid w-full max-w-sm items-center gap-1.5  mt-10">
                <Label htmlFor="username">아이디</Label>
                <Input type="text" id="username" placeholder="아이디" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5  mt-10">
                <Label htmlFor="password">비밀번호</Label>
                <Input type="password" id="password" placeholder="비밀번호" />
            </div>
            {/*  /main 더미 데이터*/}
            <Link to="/main" className="mb-[5%]">
                <Button variant="default" className="w-full">
                    로그인
                </Button>
            </Link>
        </>
    );
}
