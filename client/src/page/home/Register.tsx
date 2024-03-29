import axios from '@/api/axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';

import { useEffect, useState } from 'react';
import Cta from '@/components/Cta';

interface RegisterForm {
  name: string;
  userid: string;
  nickname: string;
  password: string;
  confirmPassword: string;
  profilePic?: FileList;
}

const schema = yup
  .object({
    name: yup
      .string()
      .required('* 이름은 필수입니다.')
      .min(2, '이름은 2글자 이상 8글자 이하로 작성해주세요.')
      .max(8, '이름은 2글자 이상 8글자 이하로 작성해주세요.')
      .matches(/^[가-힣]+$/, '* 이름은 한글로만 작성해주세요.'),

    userid: yup
      .string()
      .required('* 아이디는 필수입니다.')
      .min(5, '아이디는 5글자 이상 12글자 이하로 작성해주세요')
      .max(12, '아이디는 5글자 이상 12글자 이하로 작성해주세요.')
      .matches(/^[A-Za-z0-9_]{5,12}$/, '아이디는 숫자, 영문으로만 작성 가능합니다.'),

    nickname: yup
      .string()
      .required('* 닉네임은 필수입니다.')
      .min(2, '닉네임은 2글자 이상 10글자 이하로 작성해주세요.')
      .max(10, '닉네임은 2글자 이상 10글자 이하로 작성해주세요.')
      .matches(/^[A-Za-z0-9가-힣]{2,12}$/, '닉네임은 영어, 한글, 포함하여 작성해주세요.'),

    password: yup
      .string()
      .required('* 비밀번호는 필수입니다.')
      .min(8, '최소 8자 이상 16자 이하로 작성해주세요.')
      .max(16, '최대 8자 이상 16자 이하로 작성해주세요.')
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{8,16}$/,
        '비밀번호는 영어, 숫자, 특수문자로 작성해주세요.',
      ),

    confirmPassword: yup
      .string()
      .required('* 비밀번호는 필수입니다.')
      .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다'),
  })
  .required();

export default function Register() {
  const [profilePic, setProfilePic] = useState<File>();
  let fileUrl = '';
  let fileName = '';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: yupResolver(schema) });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userid = watch('userid'); // 아이디 필드를 실시간으로 관찰

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '회원가입', backPath: '/' }));
  }, [dispatch]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setProfilePic(e.target.files![0]);
  }

  const onSubmit = async (form: RegisterForm) => {
    await axios({
      method: 'post',
      url: '/profileUpload/normal',
      data: {
        filename: profilePic?.name,
        type: profilePic?.type,
      },
    }).then((res) => {
      if (res.data !== '') {
        fileUrl = res.data;

        const regex = /\/([^/?#]+)[^/]*$/;
        const match = fileUrl.match(regex);

        // 추출된 파일 이름 출력
        if (match && match[1]) {
          fileName = match[1];
        }

        axios({
          method: 'put',
          url: res.data,
          data: profilePic,
          headers: {
            'Content-Type': profilePic?.type,
          },
        });
      }
      try {
        axios({
          method: 'post',
          url: '/register/normal',
          data: {
            name: form.name,
            userid: form.userid,
            nickname: form.nickname,
            password: form.password,
            profile_img: fileName,
          },
        });
        alert('회원가입이 완료되었습니다!');
        navigate('/login');
      } catch (err) {
        alert('회원가입 실패');
        console.error('회원가입 실패:', err);
      }
    });
  };

  const duplicateCheck = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // 버튼 클릭 시 폼 제출을 방지

    console.log('input 값>>>>', userid);
    await axios({
      method: 'post',
      url: '/checkid',
      data: {
        userid: userid, // 관찰하고 있는 아이디 값을 사용
      },
    })
      .then((res) => {
        console.log(res);
        // 중복 검사 결과에 따른 추가 처리...
      })
      .catch((err) => {
        console.error(err);
        // 오류 처리...
      });
  };

  return (
    <div className="flex justify-center">
      <form
        // onSubmit={handleSubmit(onSubmit)}
        className="mt-4 flex max-w-sm flex-col items-center justify-center gap-4"
      >
        <h1 className="w-full">회원가입</h1>
        <span className="w-full text-gray-500">
          반가워요!
          <br />
          그래빗과 함께 습관을 길러봐요
        </span>
        <div className="mt-10 flex w-full max-w-sm flex-col items-center gap-4">
          <Label className="flex w-full" htmlFor="name">
            이름
          </Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div className="mt-10 flex  w-full max-w-sm flex-col items-center gap-4">
          <Label className="flex w-full" htmlFor="userid">
            아이디
          </Label>
          <Input id="userid" {...register('userid')} />
          {errors.userid && <p className="text-xs text-red-500">{errors.userid.message}</p>}
          <button onClick={duplicateCheck}>아이디 중복검사</button>
        </div>
        <div className="mt-10 flex w-full max-w-sm flex-col items-center gap-4">
          <Label className="flex w-full" htmlFor="profile_img">
            프로필 사진
          </Label>
          <Input type="file" id="profile_img" onChange={handleFile} />
        </div>
        <div className="mt-10 flex w-full max-w-sm flex-col items-center gap-4">
          <Label className="flex w-full" htmlFor="nickname">
            닉네임
          </Label>
          <Input id="nickname" {...register('nickname')} />
          {errors.nickname && <p className="text-xs text-red-500">{errors.nickname.message}</p>}
        </div>
        <div className="mt-10 flex  w-full max-w-sm flex-col items-center gap-4">
          <Label className="flex w-full" htmlFor="password">
            비밀번호
          </Label>
          <Input type="password" id="password" {...register('password')} />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>
        <div className="mt-10 flex w-full  max-w-sm flex-col items-center gap-4">
          <Label className="flex w-full" htmlFor="confirmPassword">
            비밀번호 확인
          </Label>
          <Input type="password" id="confirmPassword" {...register('confirmPassword')} />
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>
        {/* <Button type="submit">회원가입</Button> */}
        <Cta text={'회원가입'} onclick={handleSubmit(onSubmit)} />
      </form>
    </div>
  );
}
