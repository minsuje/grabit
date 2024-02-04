import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { FriendSelect } from '@/types/types';

type FriendListProps = {
  friend: FriendSelect;
};

function FriendList({ friend }: FriendListProps) {
  return (
    <div className="flex items-center gap-2">
      {friend.profile_img ? (
        <>
          <Avatar>
            <AvatarImage src={friend.profile_img} />
            <AvatarFallback>{friend.nickname}</AvatarFallback>
          </Avatar>
          <span>{friend.nickname}</span>
        </>
      ) : (
        <>
          <Avatar>
            <AvatarImage src="/grabit_profile.png" />
            <AvatarFallback>{friend.nickname}</AvatarFallback>
          </Avatar>
          <span>{friend.nickname}</span>
        </>
      )}
    </div>
  );
}

export default FriendList;
