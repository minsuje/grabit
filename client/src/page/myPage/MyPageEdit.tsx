import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface FormData {
  nickname: string;
  password: string; // 이 필드는 현재 비밀번호를 담는 용도로 사용됩니다.
  changePassword: string; // 변경할 비밀번호
  confirmPassword: string;
}
//
const schema = yup
  .object({
    // 기존 필드 유효성 검증 로직...
    changePassword: yup
      .string()
      .required('* 변경 비밀번호는 필수입니다.')
      .min(8, '최소 8자 이상 16자 이하로 작성해주세요.')
      .max(16, '최소 8자 이상 16자 이하로 작성해주세요.')
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{8,16}$/,
        '비밀번호는 영어, 숫자, 특수문자 혼합하여 사용해주세요.',
      ),
    confirmPassword: yup
      .string()
      .required('* 비밀번호 확인은 필수입니다.')
      .oneOf([yup.ref('changePassword')], '비밀번호가 일치하지 않습니다'),
  })
  .required();

export default function MyPageEdit() {
  const [nickName, setNickName] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const Navigate = useNavigate();
  const { id } = useParams();
  console.log('id>>>>>', id);

  const {
    register,
    handleSubmit,
    formState: { errors }, // 버전 6라면 errors라고 작성함.
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const { nickname, password: currentPassword, changePassword } = data; // 구조 분해 할당을 사용하여 변수명을 적절하게 변경합니다.

    try {
      const payload = {
        nickname,
        currentPassword,
        changePassword,
      };

      const response = await axios.patch(`http://3.34.122.205:3000/mypage/${id}`, payload); // 수정된 payload 사용
      console.log('프로필 수정 성공:', response.data.isUser);
      setNickName(response.data.nickname);
      if (response.data.isUser === false) {
        setPasswordErr('현재 비밀번호가 올바르지 않습니다');
      } else {
        Navigate(`/mypage/${id}`);
      }
    } catch (err) {
      console.error('프로필 수정 실패:', err);
    }
  };

  // useEffect(() => {
  //   axios
  //     .get(`http://3.34.122.205:3000/friend/${id}`)
  //     .then((response) => {
  //       console.log(response);
  //     })
  //     .catch((error) => {
  //       console.error('친구 목록 불러오기 axios 오류', error);
  //     });
  // }, []);

  const handleNickNameChange = (e) => {
    setNickName(e.target.value);
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
          <Input id="nickname" {...register('nickname')} value={nickName} onChange={handleNickNameChange} />
          {errors.nickname && <p className="text-xs text-red-500">{errors.nickname.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">현재 비밀번호</Label>
          <Input id="password" type="password" {...register('password')} />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          {passwordErr && <p className="text-xs text-red-500">{passwordErr}</p>}
        </div>
        <div>
          <Label htmlFor="changePassword">변경비밀번호</Label>
          <Input id="changePassword" type="password" {...register('changePassword')} />
          {/* 에러 메시지를 표시하는 로직을 추가할 수 있습니다. */}
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
