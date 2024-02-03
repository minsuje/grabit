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
interface Friend {
  id: string;
  nickname: string;
}

export default function MyPageFriendDetail() {
  const [friendDetail, setFriendDetail] = useState<any | FriendDetail | null>('');
  const [friends, setFriends] = useState<Friend[]>([]); // 전체 친구 목록
  const { userid } = useParams();
  console.log(userid);

  useEffect(() => {
    privateApi
      .get(`http://localhost:3000/profile/${userid}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        // setFriends(response.data.friends_info);
        console.log('mypageDate>>>>>>>>>>', response);
      })
      .catch((error) => {
        console.error('친구 목록 xios 오류', error);
      });
  }, []);

  console.log(friendDetail);
  return (
    <div>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback></AvatarFallback>
      </Avatar>
      <div>
        <p>{friendDetail.nickname}</p>
      </div>

      <div className="flex justify-between">
        <div className="flex flex-col  justify-center">
          <p>2500P</p>
        </div>

        <div className="flex">
          <div>
            <p>티어</p>
            <p className="text-xs text-gray-400">순위</p>
          </div>

          <Avatar>
            <img src="https://github.com/shadcn.png" alt="Tier" />

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
          <p>1승</p>
          <p>2패</p>
          <p>3무</p>
        </div>
      </div>
      <div>
        <Button>친구 끊기</Button>
      </div>
    </div>
  );
}
