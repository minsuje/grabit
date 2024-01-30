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

export default function MyPageEdit() {
  const [nickName, setNickName] = useState<string>('');
  const [passwordErr, setPasswordErr] = useState<string>('');
  const [proFileImg, setProFileImg] = useState('');

  const Navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  console.log('id>>>>>', id);
  // FormData 인터페이스 정의
  interface FormData {
    nickname: string;
    password: string;
    changePassword: string;
    confirmPassword?: string;
  }

  // yup 스키마 정의
  const schema = yup
    .object({
      nickname: yup
        .string()
        .required('* 닉네임은 필수입니다.')
        .min(2, '닉네임은 2글자 이상 10글자 이하로 작성해주세요.')
        .max(10, '닉네임은 2글자 이상 10글자 이하로 작성해주세요.')
        .matches(/^[A-Za-z0-9가-힣]{2,12}$/, '닉네임은 영어, 한글, 포함하여 작성해주세요.'),

      password: yup.string().required('현재 비밀번호는 필수입니다.'),
      changePassword: yup.string().required('변경할 비밀번호는 필수입니다.'),
      confirmPassword: yup.string().oneOf([yup.ref('changePassword')], '비밀번호가 일치하지 않습니다.'),
    })
    .required();

  // useForm 사용

  const {
    register,
    handleSubmit,
    formState: { errors },
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

  // 프로필 이미지 요청
  useEffect(() => {
    axios
      .get(`http://3.34.122.205:3000/myPage/${id}`)
      .then((response) => {
        console.log('이미지>>>>>>', response.data);
        setProFileImg(response.data.file);
      })
      .catch((error) => {
        console.error('이미지 불러오기 axios 오류', error);
      });
  }, []);

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

  const handleNickNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickName(e.target.value);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>마이페이지</h1>
        <div className="flex justify-between">
          <Avatar>
            <AvatarImage src={proFileImg} />
            {/* <AvatarFallback>CN</AvatarFallback> */}
          </Avatar>
          <Button type="submit" variant="outline">
            프로필 수정
          </Button>
        </div>
        <Label htmlFor="profile">
          <input id="profile" type="file" />
        </Label>
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
