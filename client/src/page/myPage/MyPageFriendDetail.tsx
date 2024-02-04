import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { privateApi } from '@/api/axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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
  const [friendStatus, setFriendStatus] = useState<string>();
  const [friendUserNum, setFriendUserNum] = useState<number>();

  // const [addFriendButtonText, setAddFriendButtonText] = useState<string>('친구추가');
  // const [deleteFriendButtonText, setDeleteFriendButtonText] = useState<string>('친구삭제');

  const navigate = useNavigate();
  const userid_num = Number(localStorage.getItem('userid_num'));

  console.log(userid_num);

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
      url: `http://localhost:3000/friend/${userid_num}`,
      data: { other_userid: userid },
      headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
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
      url: `http://localhost:3000/friend/${userid_num}`,
      data: { other_userid_num: friendUserNum, is_friend: false },
      headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
    })
      .then((response) => {
        console.log('친구 추가 요청 성공:', response);
        alert(response.data.msg);
        navigate(`/mypage/`);
      })
      .catch((error) => {
        console.error('친구 추가 요청 에러:', error);
      });
  };
  // 유저 친구 요청 수락
  const handleAcceptFriend = () => {
    console.log('userid >>>>>>>>>>>>>>>>>>>', userid);
    privateApi({
      method: 'Patch',
      url: `http://localhost:3000/friend/${userid_num}`,
      data: { other_userid_num: friendUserNum, is_friend: false },
      headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
    })
      .then((response) => {
        console.log('친구 추가 요청 성공:', response);
        alert(response.data.msg);
        navigate(`/mypage/`);
      })
      .catch((error) => {
        console.error('친구 추가 요청 에러:', error);
      });
  };

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
      {/* 친구 상태에 따라 조건부 렌더링 */}
      {friendStatus === '친구 신청' && (
        <div>
          <Button onClick={handleAddFriend}>친구 신청</Button>
        </div>
      )}
      {friendStatus === '친구입니다.' && (
        <div>
          <Button onClick={handleDeleteFriend}>친구 삭제</Button>
        </div>
      )}
      {friendStatus === '친구 신청 해놓고 대기 중' && (
        <div>
          <Button disabled>친구 신청 해놓고 대기 중</Button>
        </div>
      )}
      {friendStatus === '상대가 친구 신청 해놓은거 수락바람' && (
        <div>
          <Button onClick={handleAcceptFriend}>수락완료</Button>
        </div>
      )}
    </div>
  );
}
