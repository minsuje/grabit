import { privateApi } from '@/api/axios';
import { useEffect, useState } from 'react';
import MyPageFriendList from '../../components/MyPageFriendList';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';

// 친구 객체를 위한 인터페이스 정의
interface Friend {
  id: number;
  nickname: string;
}

export default function Friend() {
  const dispatch = useDispatch();
  // const { userid_num } = useParams();
  const userid_num = localStorage.getItem('userid_num');
  const [friends, setFriends] = useState<Friend[]>([]); // 전체 친구 목록
  const [searchTerm, setSearchTerm] = useState(''); // 검색어
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]); // 필터링된 친구 목록

  // 내 친구 목록 불러오기

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '친구 목록', backPath: `/mypage` }));
  }, [dispatch]);

  useEffect(() => {
    privateApi
      .get(`http://localhost:3000/friend/${userid_num}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        setFriends(response.data.friends_info);
        console.log('>>>>>친구계정', response);
      })
      .catch((error) => {
        console.error('친구 목록 불러오기? axios 오류', error);
      });
  }, []);

  // 친구 검색 목록
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
        <Input placeholder="닉네임을 입력해주세요" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        {/* 각각의 친구목록 상세 페이지 */}
        <Link to="/friend/new/">
          <Button>친구 추가</Button>
        </Link>
      </div>
      {filteredFriends.length > 0 ? (
        filteredFriends.map((friend, index) => <MyPageFriendList key={index} friends={friend} />)
      ) : (
        <p>존재하지 않는 닉네임입니다</p>
      )}
    </div>
  );
}
