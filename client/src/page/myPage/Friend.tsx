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
      .get(`/friend/${userid_num}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        setFriends(response.data.friends_info);
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
      <div className="flex w-full items-center justify-center">
        <h1 className="w-full">친구 목록</h1>
        <Link to="/friend/new/">
          <Button>친구 추가</Button>
        </Link>
      </div>
      <div className="my-6 flex w-full gap-2">
        <Input
          placeholder="닉네임을 입력해주세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex w-full"
        />
        <Button className="flex w-fit" variant={'secondary'}>
          검색
        </Button>
      </div>
      <div className="friendList flex flex-col gap-4">
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend, index) => <MyPageFriendList key={index} friends={friend} />)
        ) : (
          <p>존재하지 않는 닉네임입니다</p>
        )}
      </div>
    </div>
  );
}
