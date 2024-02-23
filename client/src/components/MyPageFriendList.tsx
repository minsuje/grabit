// import { Input } from './ui/input';
import { privateApi } from '@/api/axios';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { AvatarImage } from '@/components/ui/avatar';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MyPageFriendList({ friends }: any) {
  useEffect(() => {
    // 랭킹 요청
    privateApi
      .get(`/myRanking`)
      .then(() => {})
      .catch((error) => {
        console.error(' 랭킹 axios 오류', error);
      });
  }, []);

  const tierImages = {
    silver: '/silverTear.png',
    platinum: '/platinumTear.png',
    diamond: '/diamondTear.png',
    challenger: '/challengerTear.png',
  };

  function getTierImage(score: any) {
    if (score >= 2000) return tierImages.challenger;
    if (score >= 1500) return tierImages.diamond;
    if (score >= 1000) return tierImages.platinum;
    return tierImages.silver;
  }

  const getTierName = (score: number) => {
    if (score >= 2000) return '챌린저';
    if (score >= 1500) return '다이아';
    if (score >= 1000) return '플래티넘';
    return '실버';
  };

  const tierImageSrc = getTierImage(friends.score_num);
  const tierName = getTierName(friends.score_num);

  return (
    <Link to={`/friend/${friends.userid}`} className=" flex text-black no-underline">
      <div className="flex w-full gap-2 rounded-lg bg-white p-6 shadow-lg shadow-grabit-600/10">
        <div className="flex w-full items-center gap-2">
          <Avatar>
            <AvatarImage src={friends.profile_img ? friends.profile_img : '/grabit_profile.png'} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-stone-700">{friends.nickname}</span>
            <p className="flex text-sm font-bold text-grabit-600"> </p>
            {friends.score_num}
            <p className="ml-[2px]">포인트</p>
          </div>
        </div>

        <div className="flex w-fit flex-col items-center">
          <div className="tierImage w-12">
            <img src={tierImageSrc} alt="Tier" />
          </div>
          <p>{tierName}</p>
          <p className="text-xs font-bold text-stone-500">{friends.rank}위</p>
        </div>
      </div>
    </Link>
  );
}
