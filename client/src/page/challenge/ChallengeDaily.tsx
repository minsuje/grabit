import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { dailyMission } from '@/types/types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';

function ChallengeDaily() {
  const dispatch = useDispatch();
  const { mission_id } = useParams();
  const [dailyMission, setDailyMission] = useState<dailyMission>();

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '오늘의 미션', backPath: '/main' }));
  }, [dispatch]);

  useEffect(() => {
    {
      axios
        .get(`http://3.34.122.205:3000/challengeDaily/${mission_id}`)
        .then((response) => {
          console.log(response.data);
          setDailyMission(response.data);
        })
        .catch((error) => {
          console.error('ChallengeList에서  오류발생 :', error);
        });
    }
  }, []);

  return (
    <div className="">
      <div className="p-3 text-center text-5xl font-extrabold">데일리 미션</div>
      <h1>{dailyMission != undefined && dailyMission.mission_content}</h1>

      <br />

      <div className="mt-5 p-2 text-center">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <span className=" bg-black p-3  text-white">인증하기</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator />
            <DropdownMenuItem> 사진 촬영</DropdownMenuItem>
            <DropdownMenuItem>사진 앨범</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
export default ChallengeDaily;
