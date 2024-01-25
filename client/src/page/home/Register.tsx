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
            .min(2, '이름은 2글자 이상 8글자 이하로 작성해주세요.')
            .max(8, '이름은 2글자 이상 8글자 이하로 작성해주세요.')
            .matches(/^[가-힣]+$/, '* 이름은 한글로만 작성해주세요.'),

        userid: yup
            .string()
            .required('* 아이디는 필수입니다.')
            .min(5, '아이디는 6글자 이상 12글자 이하로 작성해주세요')
            .max(12, '아이디는 12글자 이상 12글자 이하로 작성해주세요.')
            .matches(/^[A-Za-z0-9_]{5,12}$/, '아이디는 숫자, 영문으로만 작성 가능합니다.'),

        nickname: yup
            .string()
            .required('* 닉네임은 필수입니다.')
            .min(4, '닉네임은 4글자 이상 10글자 이하로 작성해주세요.')
            .max(10, '닉네임은 4글자 이상 10글자 이하로 작성해주세요.')
            .matches(/^[A-Za-z0-9가-힣]{4,12}$/, '닉네임은 영어, 한글, 포함하여 작성해주세요.'),

        password: yup
            .string()
            .required('* 비밀번호는 필수입니다.')
            .min(8, '최소 8자 이상 16자 이하 작성 가능합니다.')
            .max(16, '최대 8자 이상 16자 이하 작성 가능합니다.')
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
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>({ resolver: yupResolver(schema) });
    const navigate = useNavigate();

    const onSubmit = async (data: RegisterForm) => {
        try {
            const response = await axios.post('https://3.34.122.205:3000/register/normal', data);
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
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
            <div>
                <Label htmlFor="userid">아이디</Label>
                <Input id="userid" {...register('userid')} />
                {errors.userid && <p className="text-red-500 text-xs">{errors.userid.message}</p>}
            </div>

            <div>
                <Label htmlFor="profilePic">프로필 사진</Label>
                <Input type="file" id="profilePic" {...register('profilePic')} />
            </div>
            <div>
                <Label htmlFor="nickname">닉네임</Label>
                <Input id="nickname" {...register('nickname')} />
                {errors.nickname && <p className="text-red-500 text-xs">{errors.nickname.message}</p>}
            </div>
            <div>
                <Label htmlFor="password">비밀번호</Label>
                <Input type="password" id="password" {...register('password')} />
                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>
            <div>
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input type="password" id="confirmPassword" {...register('confirmPassword')} />
                {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit">회원가입</Button>
        </form>
    );
}
