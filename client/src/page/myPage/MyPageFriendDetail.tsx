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
  const [, setMyRank] = useState();
  const [win, setWin] = useState();
  const [lose, setLose] = useState();
  const [scoreNum, setScoreNum] = useState<number>(0);
  const [proFileImg, setProFileImg] = useState();
  const [friendStatus, setFriendStatus] = useState<string>();
  const [friendUserNum, setFriendUserNum] = useState<number>();

  // const [addFriendButtonText, setAddFriendButtonText] = useState<string>('친구추가');
  // const [deleteFriendButtonText, setDeleteFriendButtonText] = useState<string>('친구삭제');

  const navigate = useNavigate();
  const userid_num = Number(localStorage.getItem('userid_num'));

  console.log(userid_num);

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '친구 상세', backPath: `/mypage/friend` }));
  }, [dispatch]);

  useEffect(() => {
    privateApi
      .get(`/profile/${userid}`)
      .then((response) => {
        console.log('mypageDate>>>>>>>>>>', response);
        setNickname(response.data.file.nickname);
        setMyRank(response.data.myRank);
        setWin(response.data.finalHistory.win);
        setLose(response.data.finalHistory.lose);
        setScoreNum(response.data.file.score_num);
        setProFileImg(response.data.file.profile_img);
        setFriendStatus(response.data.friendStatus);
        setFriendUserNum(response.data.file.userid_num);
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

  // 친구 삭제 요청
  const handleDeleteFriend = () => {
    console.log('userid >>>>>>>>>>>>>>>>>>>', userid);
    privateApi({
      method: 'DELETE',
      url: `/friend/${userid_num}`,
      data: { other_userid: userid },
    })
      .then((response) => {
        console.log('친구 삭제 성공:', response);
        alert('친구 삭제 완료');
        navigate(`/mypage/friend`);
      })
      .catch((error) => {
        console.error('친구 끊기 에러:', error);
      });
  };

  console.log('userid', typeof userid);

  console.log('userid_num', typeof userid_num);
  // 친구 추가 요청
  const handleAddFriend = () => {
    console.log('userid >>>>>>>>>>>>>>>>>>>', userid);
    privateApi({
      method: 'POST',
      url: `/friend/${userid_num}`,
      data: { other_userid_num: friendUserNum, is_friend: false },
    })
      .then((response) => {
        console.log('친구 추가 요청 성공>>>>>>>:', response);
        alert(response.data.msg);
        navigate(`/mypage/`);
      })
      .catch((error) => {
        console.error('친구 추가 요청 에러:', error);
      });
  };

  // 유저 친구 요청 수락 (patch)
  const handleFriendRequest = (requestType: string): void => {
    privateApi({
      method: 'patch',
      // url: `/friend/${userid_num}`,
      url: `http://localhost:3000/friend/${userid_num}`,
      data: { other_userid_num: friendUserNum, is_friend: false, type: requestType },
    })
      .then((response) => {
        console.log('친구 추가 및 거절 성공>>>>>>:', response);
        navigate(`/mypage/`);
      })
      .catch((error) => {
        console.error('친구 추가 요청 에러:', error);
      });
  };

  console.log('>>>>>', win);
  console.log(friendDetail);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <Avatar className="flex h-20 w-20">
          <AvatarImage src={proFileImg ? proFileImg : '/grabit_profile.png'} />
          <AvatarFallback></AvatarFallback>
        </Avatar>
        <h2 className="font-['SUITE Variable'] text-grabit-700 flex font-light">{nickname}</h2>
      </div>

      <div className="my-8 flex w-full items-center justify-center text-center">
        <div className="tier flex w-full basis-1/4 flex-col items-center justify-center">
          <img src={tierImageSrc} alt="Tier Image" className="glowing-image w-12 " />
          <p className="text-2xl font-bold text-stone-700">{tierName}</p>
          {/* <p className="text-xl text-stone-500">{ranking}위</p> */}
        </div>
        <div className="mt-1 flex h-full w-full basis-2/4 flex-col justify-center">
          <p className="font-['SUITE Variable'] text-2xl">{scoreNum}</p>
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

      {/* 친구 상태에 따라 조건부 렌더링 */}
      {friendStatus === '친구 신청' && (
        <div>
          <Button onClick={handleAddFriend}>친구 신청</Button>
        </div>
      )}
      {friendStatus === '친구입니다.' && (
        <div>
          <Button onClick={handleDeleteFriend}>친구 끊기</Button>
        </div>
      )}
      {friendStatus === '친구 신청 해놓고 대기 중' && (
        <div>
          <Button disabled>친구신청대기중</Button>
        </div>
      )}
      {friendStatus === '상대가 친구 신청 해놓은거 수락바람' && (
        <div>
          <Button onClick={() => handleFriendRequest('accept')}>친구수락</Button>
          <Button onClick={() => handleFriendRequest('reject')}>친구거절</Button>
        </div>
      )}
    </div>
  );
}
