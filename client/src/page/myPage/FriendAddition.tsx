import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { privateApi } from '@/api/axios';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';

// 친구 객체를 위한 인터페이스 정의
interface Friend {
  id: number;
  nickname: string;
}
// 검색 결과를 위한 인터페이스 정의
interface SearchResult {
  nickname: string;
  profile_img: string;
  score_num: number;
  userid_num: number;
  finalHistory: {
    lose: number;
    total: number;
    win: number;
  };
  myRank: number;
  userid: string;
  file: any;
}

export default function FriendAddition() {
  const dispatch = useDispatch();
  const [friends] = useState<Friend[]>([]); // 전체 친구 목록
  const [searchTerm, setSearchTerm] = useState(''); // 검색어
  const [, setFilteredFriends] = useState<Friend[]>([]); // 필터링된 친구 목록
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [scoreNum] = useState<number>(0);

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '친구 추가', backPath: -1 }));
  }, [dispatch]);

  useEffect(() => {
    const results = friends.filter((friend) => friend.nickname.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredFriends(results);
  }, [searchTerm, friends]);

  const handleSubmit = () => {
    privateApi
      .get(`/profile/${searchTerm}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        setSearchResult(response.data);
      })
      .catch((error) => {
        console.error('친구 목록 불러오기 axios 오류', error);
        setSearchResult(null);
      });
  };

  const getTierImage = (score: number) => {
    if (score >= 2000) return '/challengerTear.png';
    if (score >= 1500) return '/diamondTear.png';
    if (score >= 1000) return '/platinumTear.png';
    return '/silverTear.png';
  };

  const getTierName = (score: number) => {
    if (score >= 2000) return '챌린저';
    if (score >= 1500) return '다이아';
    if (score >= 1000) return '플래티넘';
    return '실버';
  };

  const tierImageSrc = getTierImage(scoreNum);
  const tierName = getTierName(scoreNum);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1>유저 검색</h1>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="아이디를 입력해 주세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={handleSubmit}>검색</Button>
      </div>
      {searchResult ? (
        // 검색 결과가 있을 때 렌더링

        <Link to={`/friend/${searchTerm}`} className="flex w-full font-bold text-stone-600">
          <div className="flex w-full items-center justify-center gap-2">
            <Avatar>
              <AvatarImage src={searchResult.file.profile_img} />
              <AvatarFallback />
            </Avatar>
            <div className="flex w-full flex-col">
              <h2>{searchResult.userid}</h2>
              <div className="flex w-full gap-3">
                <p>{searchResult.file.score_num} 포인트</p>
                <p>{searchResult.myRank} 위</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <img src={`${tierImageSrc}`} alt="" width={40} />
              <p>{tierName}</p>
            </div>
            {/* 기타 필요한 정보 렌더링 */}
          </div>
        </Link>
      ) : (
        <div className="flex h-full min-h-60 w-full items-center justify-center text-center">
          <p className="flex text-stone-400">존재하지 않는 닉네임입니다</p>
        </div>
      )}

      {/* <MyPageFriendDetail></MyPageFriendDetail> */}
    </div>
  );
}
