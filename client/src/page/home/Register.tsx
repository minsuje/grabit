import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';

import { useState } from 'react';

export function Register() {
    const { type } = useParams();
    const [name, setName] = useState(''); // 이름
    const [username, setUsername] = useState(''); // 아이디
    const [nickname, setNickname] = useState(''); // 닉네임
    const [password, setPassword] = useState(''); // 패스워드
    const [confirmPassword, setConfirmPassword] = useState(''); // 패스워드 확인

    const [passwordError, setPasswordError] = useState(''); // 비밀번호 유효성 검사 값 저장

    const navigate = useNavigate(); //useNavigate 훅을 사용하여 navigate 함수를 가져옴

    // 비밀번호 유효성 검사
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword, confirmPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        validatePassword(password, newConfirmPassword);
    };

    const validatePassword = (newPassword: string, newConfirmPassword: string) => {
        if (newPassword.length < 8) {
            setPasswordError('비밀번호는 최소 8자 이상이어야 합니다.');
        } else if (newPassword !== newConfirmPassword) {
            setPasswordError('비밀번호가 일치하지 않습니다.');
        } else {
            setPasswordError('');
        }
    };

    const register = () => {
        if (passwordError) {
            window.alert('비밀번호를 확인하세요.');
            return;
        }

        axios
            .post('/register/normal', {
                name,
                username,
                nickname,
                password,
            })
            .then((res) => {
                console.log('회원가입 성공:', res);
                navigate('/login');
            })
            .catch((err) => {
                console.error('회원가입 실패:', err);
            });
    };

    console.log(`이름 : ${name}`);
    console.log(`아이디 : ${username}`);
    console.log(`닉네임 : ${nickname}`);
    console.log(`password: ${password}`);
    console.log(`비밀번호확인: ${confirmPassword}`);

    return (
        <>
            <div className="flex flex-col h-screen justify-center items-center ">
                <div className="border-solid border-2 border-gray-100 p-20">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="name">이름</Label>
                        <Input
                            type="text"
                            value={name}
                            id="name"
                            placeholder="이름"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5  mt-10">
                        <Label htmlFor="username">아이디</Label>
                        <Input
                            type="text"
                            value={username}
                            id="username"
                            placeholder="아이디"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5  mt-10">
                        <Label htmlFor="nickname">닉네임</Label>
                        <Input
                            type="text"
                            value={nickname}
                            id="nickname"
                            placeholder="닉네임"
                            onChange={(e) => setNickname(e.target.value)}
                        />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5  mt-10">
                        <Label htmlFor="profilePic">프로필 사진</Label>
                        <Input type="file" id="profilePic" placeholder="프로필 사진" />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5  mt-10">
                        <Label htmlFor="password">비밀번호</Label>
                        <Input
                            type="password"
                            value={password}
                            id="password"
                            placeholder="비밀번호"
                            onChange={handlePasswordChange}
                        />
                        {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5  mt-10">
                        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                        <Input
                            type="password"
                            id="confirmPassword"
                            placeholder="비밀번호 확인"
                            onChange={handleConfirmPasswordChange}
                        />
                        {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
                    </div>
                    <div className=" flex justify-center items-center">
                        <Button
                            variant="default"
                            className="mt-20 "
                            onClick={() => {
                                register();
                            }}
                        >
                            회원가입
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
