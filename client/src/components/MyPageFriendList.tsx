// import { Input } from './ui/input';
import { privateApi } from '@/api/axios';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function MyPageFriendList({ friends }: any) {
  useEffect(() => {
    // 랭킹 요청
    privateApi
      .get(`http://localhost:3000/myRanking`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {})
      .catch((error) => {
        console.error(' 랭킹 axios 오류', error);
      });
  }, []);

  console.log(',friends', friends);
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
    <div>
      <Link to={`/friend/${friends.userid}`} className=" text-black no-underline">
        <div className="mb-[5%] flex  w-[100%] justify-between rounded-lg bg-gray-200 p-6  shadow-md">
          <div className="flex">
            <Avatar>
              <AvatarImage src={friends.profile_img ? friends.profile_img : '/grabit_profile.png'} />
              <AvatarFallback></AvatarFallback>
            </Avatar>
            <div>
              {friends.nickname}
              <p>{friends.score_num}</p>
            </div>
          </div>

          <div className="mr-5 flex w-[100%] flex-col text-end">
            <p>{tierName}</p>
            <p className="text-xs text-gray-400">{friends.rank}위</p>
          </div>

          {/* 점수별로 띄워주는 이미지를 다르게 하기 */}
          <div className="flex">
            <Avatar>
              <img src={tierImageSrc} alt="Tier" />
              {/* <AvatarImage src={friends.profile_img} /> */}
              <AvatarFallback></AvatarFallback>
            </Avatar>
            {/* <img src={friends.profile_img} alt="friends.profile_img" className="w-[25%]bg-cover" /> */}
          </div>
        </div>
      </Link>
    </div>
  );
}
