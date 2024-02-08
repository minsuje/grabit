export class CreateFriendDto {
  friend_id?: number;
  userid_num: number;
  other_userid_num: number;
  is_friend?: boolean;
  userid?: string;
  other_userid: string;
  type?: string;
}
