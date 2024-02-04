import { useDispatch, useSelector } from 'react-redux';
import { addFriend, removeFriend } from '@/store/friendSlice';
import FriendList from '@/components/FriendList';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {} from 'react-redux';
import { RootState } from '@/store/store';
import { privateApi } from '@/api/axios';
import { useState, useEffect } from 'react';
import { FriendSelect } from '@/types/types';

function FriendSelect() {
  const [friends, setFriends] = useState<FriendSelect[]>([]);
  const selectedFriends = useSelector((state: RootState) => state.friend.selectedFriends);
  const dispatch = useDispatch();

  const handleCheckboxChange = (friend: FriendSelect, isChecked: boolean) => {
    if (isChecked) {
      dispatch(addFriend(friend));
    } else {
      dispatch(removeFriend(friend));
    }
  };

  const userid_num = Number(localStorage.getItem('userid_num'));

  useEffect(() => {
    privateApi
      .get(`http://3.34.122.205:3000/friend/${userid_num}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        console.log('response.data>>>>>>>', response.data);
        setFriends(response.data.friends_info);
      })
      .catch((error) => {
        console.error('챌린지 생성 > 친구 선택 오류 :', error);
      });
  }, []);

  return (
    <div>
      <h1>친구 목록</h1>
      <form>
        {friends.map((friend) => (
          <div key={friend.userid_num} className="friendItem flex items-center gap-2">
            <Checkbox
              id={'FriendItem' + friend.userid_num}
              checked={selectedFriends.some((selected) => selected.userid_num === friend.userid_num)}
              onCheckedChange={(isChecked: boolean) => handleCheckboxChange(friend, isChecked)}
            />
            <label htmlFor={'FriendItem' + friend}>
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
