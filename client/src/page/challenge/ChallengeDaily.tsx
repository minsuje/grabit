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

function ChallengeDaily() {
  const { mission_id } = useParams();
  const [dailyMission, setDailyMission] = useState<dailyMission>();

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
    <div className="container">
      <div className="text-center font-extrabold text-5xl p-3">데일리 미션</div>
      <h1>{dailyMission != undefined && dailyMission.mission_content}</h1>

      <br />

      <div className="text-center p-2 mt-5">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <span className=" bg-black text-white  p-3">인증하기</span>
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
