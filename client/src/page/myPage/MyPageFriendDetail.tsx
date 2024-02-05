import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { privateApi } from '@/api/axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';
interface FriendDetail {
  id: string;
  nickname: string;
  profile_img: string;
  score: number;
}

// 친구 객체를 위한 인터페이스 정의

export default function MyPageFriendDetail() {
  const dispatch = useDispatch();
  const [friendDetail] = useState<any | FriendDetail | null>('');
  const { userid } = useParams();
  const [nickname, setNickname] = useState();
  const [myRank, setMyRank] = useState();
  const [win, setWin] = useState();
  const [lose, setLose] = useState();
  const [scoreNum, setScoreNum] = useState<number>(0);
  const [proFileImg, setProFileImg] = useState();

  const navigate = useNavigate();
  const userid_num = localStorage.getItem('userid_num');

  console.log(userid_num);

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '친구 상세', backPath: `/mypage/friend` }));
  }, [dispatch]);

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

  // useEffect(() => {
  //   privateApi
  //     .get(`http://localhost:3000/friend/${userid_num}`, {
  //       headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
  //     })
  //     .then((response) => {
  //       console.log('mypageDate>>>>>>>>>>???', response);
  //     })
  //     .catch((error) => {
  //       console.error('친구 목록 axios 오류???', error);
  //     });
  // }, []);

  const handleDeleteFriend = () => {
    console.log('userid >>>>>>>>>>>>>>>>>>>', userid);
    // privateApi
    //   .delete(`http://localhost:3000/friend/${userid_num}`, {
    //     headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken'), data: userid },
    //   })
    privateApi({
      method: 'DELETE',
      url: `http://localhost:3000/friend/${userid_num}`,
      data: { other_userid: userid },
      headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
    })
      .then((response) => {
        console.log('친구 삭제 성공:', response);
        navigate(`/mypage/friend`);
      })
      .catch((error) => {
        console.error('친구 끊기 에러:', error);
      });
  };

  console.log('>>>>>', win);
  console.log(friendDetail);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <Avatar className="flex h-20 w-20">
          <AvatarImage src={proFileImg} />
          <AvatarFallback></AvatarFallback>
        </Avatar>
        <h2 className="flex font-['SBAggroB'] font-light text-grabit-700">{nickname}</h2>
      </div>

      <div className="my-8 flex w-full items-center justify-center text-center">
        <div className="tier flex w-full basis-1/4 flex-col items-center justify-center">
          <img src={tierImageSrc} alt="Tier Image" className="glowing-image w-12 " />
          <p className="text-2xl font-bold text-stone-700">{tierName}</p>
          {/* <p className="text-xl text-stone-500">{ranking}위</p> */}
        </div>
        <div className="mt-1 flex h-full w-full basis-2/4 flex-col justify-center">
          <p className="font-['SBAggroB'] text-2xl">{scoreNum}</p>
          <p className="text-xl font-bold text-stone-500">포인트</p>
        </div>
        <div className="flex w-full basis-1/4  flex-col items-center justify-center">
          {/* <h3 className="text-xl font-medium text-stone-500">전적</h3> */}
          <p className="flex text-2xl font-bold text-stone-700">
            {win}
            <p className="ml-1 flex">승</p>
          </p>
          <p className="flex text-2xl font-bold text-stone-700">
            {lose}
            <p className="ml-1 flex">패</p>
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center">
        <Button onClick={handleDeleteFriend}>친구 끊기</Button>
      </div>
    </div>
  );
}
