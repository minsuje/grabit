import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MyPageFriendList from '../../components/MyPageFriendList';

export default function Friend() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const userid = 1; // props 대체 예정
    axios
      .get(`http://3.34.122.205:3000/friend/${userid}`)
      .then((response) => {
        console.log(response.data);
        setFriends(response.data);
      })
      .catch((error) => {
        console.error('친구 목록 불러오기 axios 오류', error);
      });
  }, []);

  return (
    <div>
      <Link to="">
        <MyPageFriendList />
      </Link>
    </div>
  );
}
