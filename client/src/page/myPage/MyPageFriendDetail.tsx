import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { privateApi } from '@/api/axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
interface FriendDetail {
  id: number;
  nickname: string;
  profile_img: string;
  score: number;
}

export default function MyPageFriendDetail() {
  const [friendDetail, setFriendDetail] = useState<any | FriendDetail | null>('');
  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    privateApi
      .get(`http://3.34.122.205:3000/friendDetail/${id}`)
      .then((response) => {
        // 상세 정보 설정
        console.log(response.data);
        const detail = response.data.friends_info[0];
        setFriendDetail(detail);
      })
      .catch((error) => {
        console.error('친구 목록 불러오기 axios 오류', error);
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
