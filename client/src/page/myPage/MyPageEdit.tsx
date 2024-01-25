import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface FormData {
    nickname: string;
    password: string;
    confirmPassword: string;
}

const schema = yup
    .object({
        nickname: yup
            .string()
            .required('* 닉네임은 필수입니다.')
            .min(4, '닉네임은 4자 이하 이내여야 합니다.')
            .max(10, '닉네임은 12자 이하 이내여야 합니다.')
            .matches(/^[A-Za-z0-9가-힣]{4,12}$/, '닉네임은 영어, 한글, 숫자만 가능합니다.'),

        password: yup
            .string()
            .required('* 비밀번호는 필수입니다.')
            .min(8, '최소 8자 이상 작성해야 합니다.')
            .max(16, '최대 16자까지 작성 가능합니다.')
            .matches(
                /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{8,16}$/,
                '비밀번호는 영어, 숫자, 특수문자만 가능합니다.',
            ),

        confirmPassword: yup
            .string()
            .required('* 비밀번호는 필수입니다.')
            .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다'),
    })
    .required();

export default function MyPageEdit() {
    const Navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }, // 버전 6라면 errors라고 작성함.
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            const response = await axios.patch('http://3.34.122.205:3000/Mypage', data);
            console.log('회원가입 성공:', response);
            Navigate('');
        } catch (err) {
            console.error('회원가입 실패:', err);
        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <h1>마이페이지</h1>
                <div className="flex justify-between">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        {/* <AvatarFallback>CN</AvatarFallback> */}
                    </Avatar>
                    <Button type="submit" variant="outline">
                        프로필 수정
                    </Button>
                </div>
                <div>
                    <Label htmlFor="nickname">닉네임</Label>
                    <Input id="nickname" {...register('nickname')} />
                    {errors.nickname && <p className="text-red-500 text-xs">{errors.nickname.message}</p>}
                </div>
                <div>
                    <Label htmlFor="password">비밀번호</Label>
                    <Input id="password" type="password" {...register('password')} />
                    {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                </div>
                <div>
                    <Label htmlFor="confirmPassword">비밀번호확인</Label>
                    <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
                    {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
                </div>
            </div>
        </form>
    );
}
