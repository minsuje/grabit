import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { privateApi } from '@/api/axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
interface FriendDetail {
  id: string;
  nickname: string;
  profile_img: string;
  score: number;
}

// 친구 객체를 위한 인터페이스 정의

export default function MyPageFriendDetail() {
  const [friendDetail] = useState<any | FriendDetail | null>('');
  const { userid } = useParams();
  const [nickname, setNickname] = useState();
  const [myRank, setMyRank] = useState();
  const [win, setWin] = useState();
  const [lose, setLose] = useState();
  const [scoreNum, setScoreNum] = useState<number>(0);
  const [proFileImg, setProFileImg] = useState();

  console.log(userid);

  useEffect(() => {
    privateApi
      .get(`http://localhost:3000/profile/${userid}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        console.log('mypageDate>>>>>>>>>>', response);
        setNickname(response.data.file.nickname);
        setMyRank(response.data.myRank);
        setWin(response.data.finalHistory.win);
        setLose(response.data.finalHistory.lose);
        setScoreNum(response.data.file.score_num);
        setProFileImg(response.data.file.profile_img);
      })
      .catch((error) => {
        console.error('친구 목록 xios 오류???', error);
      });
  }, []);

  // 티어 이미지, 티어 이름
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

  useEffect(() => {
    privateApi
      .get(`http://localhost:3000/friend/2`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        console.log('mypageDate>>>>>>>>>>???', response);
      })
      .catch((error) => {
        console.error('친구 목록 axios 오류???', error);
      });
  }, []);

  console.log('>>>>>', win);
  console.log(friendDetail);

  return (
    <div>
      <Avatar>
        <AvatarImage src={proFileImg} />
        <AvatarFallback></AvatarFallback>
      </Avatar>
      <div>
        <p>{nickname}</p>
      </div>

      <div className="flex justify-between">
        <div className="flex flex-col  justify-center">
          <p>{scoreNum}</p>
        </div>

        <div className="flex">
          <div>
            <p>{tierName}</p>
            <span className="text-xs text-gray-400">{myRank}위</span>
          </div>

          {/* 티어 이미지 */}
          <Avatar>
            <img src={tierImageSrc} alt="Tier" />

            {/* <AvatarImage src={friends.profile_img} /> */}
            <AvatarFallback></AvatarFallback>
          </Avatar>

          {/* <img src={friends.profile_img} alt="friends.profile_img" className="w-[25%]bg-cover" /> */}
        </div>
      </div>

      {/* 점수별로 띄워주는 이미지를 다르게 하기 */}
      <div className="flex justify-between">
        <p>전적</p>
        <div className="flex">
          <p>{win}승</p>
          <p>{lose}패</p>
        </div>
      </div>
      <div>
        <Button>친구 끊기</Button>
      </div>
    </div>
  );
}
