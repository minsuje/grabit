import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Login() {
    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            // 서버의 로그인 엔드포인트에 요청을 보냅니다. 이 부분을 수정하세요.
            const response = await axios.post('http://43.201.22.60:3000/login', { userid, password });
            console.log('로그인 성공:>>>>>>>>>>>>>>>', response.data.userid);
            const user = response.data.find(u => u.userid === userid);


            if (user) {
                console.log('로그인 성공:', response.data.userid);
                navigate('/main');
            } else {
                // 로그인 실패 처리
                console.error('로그인 실패: 유효하지 않은 사용자 정보');
            }

            // 로그인 성공 후 메인 페이지로 이동
        } catch (error) {
            console.error('로그인 실패:', error);
            // 오류 처리 로직을 여기에 작성하세요.
        }
    };
    return (
        <>
            <div className="grid w-full max-w-sm items-center gap-1.5  mt-10">
                <Label htmlFor="username">아이디</Label>
                <Input
                    type="text"
                    id="username"
                    placeholder="아이디"
                    value={userid}
                    onChange={(e) => setUserid(e.target.value)}
                />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5  mt-10">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                    type="password"
                    id="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <Button variant="default" className="w-full" onClick={handleLogin} disabled={!userid || !password}>
                로그인
            </Button>
            <Link to="/main" className="mb-[5%]"></Link>
        </>
    );
}
