// import { Input } from './ui/input';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

export default function MyPageFriendList({ friends }: any) {
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

  const tierImageSrc = getTierImage(friends.score_num);
  return (
    <div>
      <Link to={`/friend/${friends.userid_num}`} className=" text-black no-underline">
        <div className="mb-[5%] flex  justify-between w-[100%] rounded-lg bg-gray-200 p-6  shadow-md">
          <div className="flex">
            <Avatar>
              <AvatarImage src={friends.profile_img} />
              <AvatarFallback></AvatarFallback>
            </Avatar>
            <div>
              {friends.nickname}
              <p>{friends.score_num}</p>
            </div>
          </div>

          <div className="w-[100%] flex flex-col text-end mr-5">
            <p>티어</p>
            <p className="text-xs text-gray-400">순위</p>
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
