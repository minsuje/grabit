export class CreateUserDto {
  login_type: string;
  userid?: string;
  social_userid?: string;
  password?: string;
  name?: string;
  nickname?: string;
  profile_img?: string;
  score_num: number;
  carrot: number;
}

export class LoginDto {
  userid: string;
  password: string;
}
