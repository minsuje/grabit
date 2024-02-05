import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { useForm } from 'react-hook-form';

// import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import axios, { privateApi } from '@/api/axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';

export default function MyPageEdit() {
  const dispatch = useDispatch();
  const [nickName, setNickName] = useState<string>('');
  const [passwordErr] = useState<string>('');
  const [proFileImg, setProFileImg] = useState<string>('');
  const [file, setFile] = useState<File>();

  const Navigate = useNavigate();
  const { userid_num } = useParams();
  // FormData 인터페이스 정의
  interface FormData {
    nickname?: string | null;
    password: string; // 필수 필드로 정의
    changePassword?: string;
    confirmPassword?: string;
    file?: any | undefined;
  }

  // yup 스키마 정의
  // const schema = yup
  //   .object({
  //     nickname: yup?.string().nullable(),

  //     password: yup.string().required('현재 비밀번호는 필수입니다.'),
  //     // changePassword: yup.string().required('변경할 비밀번호는 필수입니다.'),
  //     // confirmPassword: yup.string().oneOf([yup.ref('changePassword')], '비밀번호가 일치하지 않습니다.'),
  //   })
  //   .required();

  // useForm 사용
  const {
    register,
    handleSubmit,
    setError,

    // formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '회원 정보 수정', backPath: `/mypage` }));
  }, [dispatch]);

  const onSubmit = async (data: FormData) => {
    const { nickname, password: currentPassword, changePassword, confirmPassword } = data; // 구조 분해 할당을 사용하여 변수명을 적절하게 변경합니다.

    if (changePassword && changePassword !== confirmPassword) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return; // 비밀번호 불일치시 함수 종료
    }
    // 비밀번호 변경을 원하는 경우 검증
    if (changePassword && changePassword !== confirmPassword) {
      // 비밀번호와 비밀번호 확인이 일치하지 않으면 오류 설정
      setError('confirmPassword', {
        type: 'manual',
        message: '비밀번호가 일치하지 않습니다.',
      });
      return; // 함수 종료
    }

    await axios({
      method: 'patch',
      url: 'http://52.79.228.200:3000/myPage',
      headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      data: {
        filename: file?.name,
        type: file?.type,
        nickname,
        currentPassword,
        changePassword,
      },
    }).then((res) => {
      console.log('res>>>>>>>>>>>>>>>>>>>>>>', res);
      console.log('patch res.data', res.data);
      console.log('patch res.data>>', res.data.file);
      alert(res.data.msg);
      axios({
        method: 'put',
        url: res.data.file,
        data: file,
        headers: {
          'Content-Type': file?.type,
        },
      }).then((res) => {
        console.log('>>>>', res);
        Navigate(`/mypage`);
      });
    });
  };

  // 프로필 이미지 요청
  useEffect(() => {
    privateApi
      .get(`http://52.79.228.200:3000/myPage`)
      .then((response) => {
        console.log('>>>>', response.data.userInfo[0]);
        setNickName(response.data.userInfo[0].nickname);
        setProFileImg(response.data.file);
      })
      .catch((error) => {
        console.error('이미지 불러오기 axios 오류', error);
      });
  }, []);

  const handleNickNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickName(e.target.value);
  };

  return (
    <div>
      {/* <input type="file" onChange={handleChange} />
      <button onClick={handleUpdate} className="rounded-md bg-blue-500 p-3 text-white">
        업데이트
      </button> */}

      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>마이페이지</h1>
        <div className="flex justify-between">
          <Avatar>
            <AvatarImage src={proFileImg ? proFileImg : '/grabit_profile.png'} />
            <AvatarFallback></AvatarFallback>
          </Avatar>

          <Button variant="outline">프로필 수정</Button>
        </div>
        <Label htmlFor="profile">
          <input
            id="profile"
            type="file"
            onChange={(e) => {
              console.log('파일 입력시 이벤트 객체', e);
              if (e.target.files?.length == 1) {
                setFile(e.target.files[0]);
                console.log(e.target.files[0]);
              }
            }}
          />
        </Label>
        <div>
          <Label htmlFor="nickname">
            <span className="text-xs text-red-500">*</span> 닉네임
          </Label>
          <Input id="nickname" {...register('nickname')} onChange={handleNickNameChange} value={nickName} />
          {/* {errors.nickname && <p className="text-xs text-red-500">{errors.nickname.message}</p>} */}
        </div>
        <div>
          <Label htmlFor="password">
            <span className="text-xs text-red-500">* </span>
            현재 비밀번호
          </Label>
          <Input id="password" type="password" {...register('password')} />
          {/* {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>} */}
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
          {/* {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>} */}
        </div>
      </form>
    </div>
  );
}
