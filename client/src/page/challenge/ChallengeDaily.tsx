
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
    <div className="flex flex-col gap-4">
      <div className="p-3 text-center text-5xl font-extrabold">데일리 미션</div>
      

<div className="text-center">
<p>오늘의 미션을 완료하고</p>
      <p>추가 포인트를 얻으세요!</p>
      <div className='border-2 rounded-md  m-2 border-pink-500'>
      <p className=''>오늘의 미션</p>
      <h1 className="text-center">{mission_content}</h1>
      </div>
    
</div>
      


     

      <div className="mt-5 p-2 text-center">
        <Cta text= "인증하기" onclick={() => {
            navigate(`/camera/0`);
          }}/>
        
      </div>
    </div>
  
  );
}
export default ChallengeDaily;
