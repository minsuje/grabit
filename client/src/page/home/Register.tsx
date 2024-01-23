import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, ChangeEvent } from 'react';
const schema = yup.object({
    name: yup.string()
    .required('* 이름은 필수입니다.')
    .min(2, '이름은 2글자 이상 8글자 이내여야 합니다.')
    .max(8, '이름은 2글자 이상 8글자 이내여야 합니다.')
    .matches(/^[가-힣]+$/, '* 이름은 한글로만 입력해야 합니다.'),

    userid: yup.string()
    .required('* 아이디는 필수입니다.')
    .min(6, '아이디는 6자 이내여야 합니다')
    .max(12, '아이디는 12자 이내여야 합니다.')
    .matches(
    /^[A-Za-z][A-Za-z0-9_]{6,12}$/,
    "아이디는 숫자, 영문으로 작성 가능합니다."
    ),

    nickname: yup.string()
    .required('* 닉네임은 필수입니다.')
    .min(4, '닉네임은 4자 이하 이내여야 합니다.')
    .max(10, '닉네임은 12자 이하 이내여야 합니다.')
    .matches(
        /^[A-Za-z0-9가-힣]{4,12}$/,
        "닉네임은 영어, 한글, 숫자만 가능합니다."
    ),

    password: yup.string()
    .required('* 비밀번호는 필수입니다.')
    .min(8, "최소 8자 이상 작성해야 합니다.")
    .max(16, "최대 16자까지 작성 가능합니다.")
    .matches(
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{8,16}$/,
    "비밀번호는 영어, 숫자, 특수문자만 가능합니다."),
    
    confirmPassword:yup.string()
    .required('* 비밀번호는 필수입니다.')
    .oneOf([yup.ref('password'), null], '비밀번호가 일치하지 않습니다')
}).required();

export function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://43.201.22.60:3000/register/normal', data);
            console.log('회원가입 성공:', response);
            navigate('/login');
        } catch (err) {
            console.error('회원가입 실패:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <Label htmlFor="name">이름</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className='text-red-500 text-xs'>{errors.name.message}</p>}
            </div>
            <div>
                <Label htmlFor="userid">아이디</Label>
                <Input id="userid" {...register('userid')} />
                {errors.userid && <p className='text-red-500 text-xs'>{errors.userid.message}</p>}
            </div>
            <div>
                <Label htmlFor="nickname">닉네임</Label>
                <Input id="nickname" {...register('nickname')} />
                {errors.nickname && <p className='text-red-500 text-xs'>{errors.nickname.message}</p>}
            </div>
            <div>
                <Label htmlFor="password">비밀번호</Label>
                <Input type="password" id="password" {...register('password')} />
                {errors.password && <p className='text-red-500 text-xs'>{errors.password.message}</p>}
            </div>
            <div>
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input type="password" id="confirmPassword" {...register('confirmPassword')} />
                {errors.confirmPassword && <p className='text-red-500 text-xs'>{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit">회원가입</Button>
        </form>
    );
}