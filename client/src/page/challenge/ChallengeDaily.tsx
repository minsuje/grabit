
import { useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';

import Cta from '@/components/Cta';

function ChallengeDaily() {
  const dispatch = useDispatch();
  const { mission_content } = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    dispatch(setHeaderInfo({ title: '오늘의 미션', backPath: '/main' }));
  }, [dispatch]);


  return (
    <div className="">
      <div className="p-3 text-center text-5xl font-extrabold">데일리 미션</div>
      <h1>{mission_content}</h1>

      <br />

      <div className="mt-5 p-2 text-center">
        <Cta text= "인증하기" onclick={() => {
            navigate(`/camera/0`);
          }}/>
        
      </div>
    </div>
  
  );
}
export default ChallengeDaily;
