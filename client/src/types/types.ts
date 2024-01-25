export interface Challenge {
  challenge_id?: number;
  userid_num?: number;
  challenge_name: string;
  topic: string;
  challenger_userid_num: number[];
  goal_money: number;
  is_public: boolean;
  term: number;
  winner_userid_num?: number | null;
  authentication_start_date: Date;
  authentication_end_date: Date;
  authentication_start_time: number;
  authentication_end_time: number;
}

export interface dailyMission {
  mission_id: number;
  mission_content: string;
  success_userid_num: number[];
}
export interface authentication {
  authentication_id: number;
  challenge_id: number;
  created_at: string;
  userid_num: number;
  authentication_img: string;
}
export interface authentication_img_emotion {
  authentication_img_emotion_id: number;
  authentication_id: number;
  authentication_img_comment_userid_num: number;
  authentication_img_comment_emotion: number;
}
export interface score {
  score_id: number;
  userid_num: number;
  score_description: string;
  score_type: string;
  score: number;
}

export interface users {
  userid_num: number;
  login_type: string;
  userid: string;
  social_userid: string;
  password: string;
  name: string;
  nickname: string;
  profile_img: string | null;
  score_num: number;
  money: number;
}
export interface account {
  account_id: number;
  userid_num: number;
  transaction_description: string;
  transaction_type: string;
  transaction_amount: number;
  status: string;
}

export interface tier {
  tier: string;
  tier_image: string;
  tier_standard: number;
}

export interface friend {
  friend_id: number;
  userid_num: number;
  other_user_num: number;
  is_friend: string;
}

export interface alarm {
  alarm_id: number;
  userid_num: number;
  reference_id: number;
  type: string;
  is_confirm: string;
  created_at: string;
}

export type Friend = {
  id: number;
  name: string;
  profile_img: string;
};

// useUserMedia 에서 사용
export type Capture_options = {
  audio: boolean;
  video: {
    facingMode: string;
  };
};
