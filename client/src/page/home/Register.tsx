import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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
      .min(2, '이름은 2글자 이상 8글자 이내여야 합니다.')
      .max(8, '이름은 2글자 이상 8글자 이내여야 합니다.')
      .matches(/^[가-힣]+$/, '* 이름은 한글로만 입력해야 합니다.'),

    userid: yup
      .string()
      .required('* 아이디는 필수입니다.')
      .min(6, '아이디는 6자 이내여야 합니다')
      .max(12, '아이디는 12자 이내여야 합니다.')
      .matches(/^[A-Za-z][A-Za-z0-9_]{6,12}$/, '아이디는 숫자, 영문으로 작성 가능합니다.'),

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

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: yupResolver(schema) });
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterForm) => {
    try {
      const response = await axios.post('https://localhost:3000/register/normal', data);
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
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="userid">아이디</Label>
        <Input id="userid" {...register('userid')} />
        {errors.userid && <p className="text-xs text-red-500">{errors.userid.message}</p>}
      </div>

      <div>
        <Label htmlFor="profilePic">프로필 사진</Label>
        <Input type="file" id="profilePic" {...register('profilePic')} />
      </div>
      <div>
        <Label htmlFor="nickname">닉네임</Label>
        <Input id="nickname" {...register('nickname')} />
        {errors.nickname && <p className="text-xs text-red-500">{errors.nickname.message}</p>}
      </div>
      <div>
        <Label htmlFor="password">비밀번호</Label>
        <Input type="password" id="password" {...register('password')} />
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
      </div>
      <div>
        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
        <Input type="password" id="confirmPassword" {...register('confirmPassword')} />
        {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
      </div>
      <Button type="submit">회원가입</Button>
    </form>
  );
}
