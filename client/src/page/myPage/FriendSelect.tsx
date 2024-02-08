import { useDispatch, useSelector } from 'react-redux';
import { addFriend, removeFriend } from '@/store/friendSlice';
import FriendList from '@/components/FriendList';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { RootState } from '@/store/store';

import { setHeaderInfo } from '@/store/headerSlice';

import { privateApi } from '@/api/axios';
import { useState, useEffect } from 'react';
import { FriendSelect } from '@/types/types';

function FriendSelect() {
  const [friends, setFriends] = useState<FriendSelect[]>([]);

  const dispatch = useDispatch();
  const selectedFriends = useSelector((state: RootState) => state.friend.selectedFriends);

  const handleCheckboxChange = (friend: FriendSelect, isChecked: boolean) => {
    if (isChecked) {
      dispatch(addFriend(friend));
    } else {
      dispatch(removeFriend(friend));
    }
  };

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '친구 선택', backPath: -1 }));
  }, [dispatch]);

  const userid_num = Number(localStorage.getItem('userid_num'));

  useEffect(() => {
    privateApi
      .get(`/friend/${userid_num}`)
      .then((response) => {
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
          <div key={friend.userid} className="friendItem flex items-center gap-2">
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
