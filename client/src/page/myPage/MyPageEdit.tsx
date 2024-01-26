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
      .min(8, '최소 8자 이상 16자 이하로 작성해주세요.')
      .max(16, '최소 8자 이상 16자 이하로 작성해주세요.')
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{8,16}$/,
        '비밀번호는 영어, 숫자, 특수문자 혼합하여 사용해주세요.',
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
      const response = await axios.patch('', data);
      console.log('프로필 수정 성공:', response);
      Navigate('/mypage');
    } catch (err) {
      console.error('프로필 수정 실패:', err);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
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
          {errors.nickname && <p className="text-xs text-red-500">{errors.nickname.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">비밀번호</Label>
          <Input id="password" type="password" {...register('password')} />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>
        <div>
          <Label htmlFor="confirmPassword">비밀번호확인</Label>
          <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>
      </form>
    </div>
  );
}
