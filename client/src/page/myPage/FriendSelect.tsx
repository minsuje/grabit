import { useDispatch, useSelector } from 'react-redux';
import { addFriend, removeFriend } from '@/store/friendSlice';
import type { Friend } from '@/types/types';
import FriendList from '@/components/FriendList';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {} from 'react-redux';
import { RootState } from '@/store/store';
import { setHeaderInfo } from '@/store/headerSlice';

const friends: Friend[] = [
  {
    id: 1,
    name: '라마',
    profile_img: 'https://github.com/shadcn.png',
  },
  {
    id: 2,
    name: '람마',
    profile_img: 'https://github.com/shadcn.png',
  },
  {
    id: 3,
    name: '마라',
    profile_img: 'https://github.com/shadcn.png',
  },
];

function FriendSelect() {
  const dispatch = useDispatch();
  const selectedFriends = useSelector((state: RootState) => state.friend.selectedFriends);

  const handleCheckboxChange = (friend: Friend, isChecked: boolean) => {
    if (isChecked) {
      dispatch(addFriend(friend));
    } else {
      dispatch(removeFriend(friend));
    }
  };

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '친구 선택', backPath: `-1` }));
  }, [dispatch]);

  return (
    <div>
      <h1>친구 목록</h1>
      <form>
        {friends.map((friend) => (
          <div key={friend.id} className="friendItem flex items-center gap-2">
            <Checkbox
              id={'FriendItem' + friend.id}
              checked={selectedFriends.some((selected) => selected.id === friend.id)}
              onCheckedChange={(isChecked: boolean) => handleCheckboxChange(friend, isChecked)}
            />
            <label htmlFor={'FriendItem' + friend.id}>
              <FriendList friend={friend} />
            </label>
          </div>
        ))}
      </form>
      <Link to={'/challengeCreate'}>
        <Button className="w-full">선택 완료</Button>
      </Link>
    </div>
  );
}

export default FriendSelect;
