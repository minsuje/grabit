import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MyPageFriendList from '../../components/MyPageFriendList';
import { Input } from '@/components/ui/input';

// 친구 객체를 위한 인터페이스 정의
interface Friend {
  id: number;
  nickname: string;
}

export default function Friend() {
  const [friends, setFriends] = useState<Friend[]>([]); // 전체 친구 목록
  const [searchTerm, setSearchTerm] = useState(''); // 검색어
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]); // 필터링된 친구 목록

  useEffect(() => {
    const userid = 1; // props 대체 예정
    axios
      .get(`http://3.34.122.205:3000/friend/${userid}`)
      .then((response) => {
        setFriends(response.data.friends_info);
      })
      .catch((error) => {
        console.error('친구 목록 불러오기 axios 오류', error);
      });
  }, []);

  useEffect(() => {
    const results = friends.filter((friend) => friend.nickname.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredFriends(results);
  }, [searchTerm, friends]);

  return (
    <div>
      <div className="flex justify-between">
        <h1>친구목록</h1>
      </div>
      <div>
        <Input placeholder="검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button>친구 추가</button>
      </div>
      {filteredFriends.length > 0 ? (
        filteredFriends.map((friend, index) => <MyPageFriendList key={index} friends={friend} />)
      ) : (
        <p>존재하지 않는 닉네임입니다</p>
      )}
    </div>
  );
}
