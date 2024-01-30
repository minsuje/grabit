import { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';
import { privateApi } from '@/api/axios';
import { useParams } from 'react-router-dom';


interface Emotion {
  count: number;
  checked: boolean;
}

function ChallengeImage() {
  const dispatch = useDispatch();

  const { challenge_id, authentication_id } = useParams();
  const emotionList: any = useRef<HTMLInputElement>(null);

  const [first, setFirst] = useState<Emotion>({
    count:0,
    checked:false
  });
  const [second, setSecond] = useState<Emotion>({
    count:0,
    checked:false
  });
  const [third, setThird] = useState<Emotion>({
    count:0,
    checked:false
  });
  const [fourth, setFourth] = useState<Emotion>({
    count:0,
    checked:false
  });

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '인증 사진', backPath: -1 }));
  }, [dispatch]);

  useEffect(() => {
    privateApi
      .get(`http://3.34.122.205:3000/challengeAuth/${challenge_id}/${authentication_id}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error): void => {
        console.error('ChallengeImage에서  오류발생 :', error);
      });
  }, []);



  function addEmotion(emotion: string) {
    switch (emotion) {
      case 'first':
        if(first.checked){
          setFirst({count:first.count-1,checked:false})
        }else{
          setFirst({count:first.count+1,checked:true})
        }
  
        
   
        break;
      case 'second':
        if(second.checked){
          setSecond({count:second.count-1,checked:false})
        }else{
          setSecond({count:second.count+1,checked:true})
        }
        break;
      case 'third':
        if(third.checked){
          setThird({count:third.count-1,checked:false})
        }else{
          setThird({count:third.count+1,checked:true})
        }
        break;
      case 'fourth':
        if(fourth.checked){
          setFourth({count:fourth.count-1,checked:false})
        }else{
          setFourth({count:fourth.count+1,checked:true})
        }
        break;
    }

    


  }


 function uploadEmo(emotion:string) {
     addEmotion(emotion);

  

    // axios.post(`XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX${challenge_id}/${authentication_id}`,{)
    // 누른 이모티콘 번호랑 userid ? 보내기
    
  }

  function showEmotion() {
    if(emotionList.current.style.display === 'block'){
      emotionList.current.style.display = 'none';
    }
    else{
      emotionList.current.style.display = 'block';}
  }
  return (
    <div className="flex flex-col gap-8">
      <h1> 인증 사진 </h1>
      <p> 이모티콘</p>
      <div>
        <img src="https://health.chosun.com/site/data/img_dir/2023/07/17/2023071701753_0.jpg"></img>

        <div className="flex flex-row justify-around">
     <p className='px-2 my-2 rounded-md bg-fuchsia-100'>😀 {first.count}</p>
     <p className='px-2 my-2 rounded-md bg-fuchsia-100'>🤣 {second.count}</p>
     <p className='px-2 my-2 rounded-md bg-fuchsia-100'>🙄 {third.count}</p>
     <p className='px-2 my-2 rounded-md bg-fuchsia-100'>😡 {fourth.count}</p>
        </div>
        <button onClick={showEmotion}>🔻</button>
        <div className="flex flex-row" ref={emotionList} style={{ display: 'none' }}>
          <button
          className="p-2 mx-2 "

            onClick={() => {
              uploadEmo('first');
            }}
          >
            😀
          </button>
    
          <button
          className="p-2 mx-2 "
            onClick={() => {
              uploadEmo('second');
            }}
          >
            🤣
          </button>
          <button
          className="p-2 mx-2 "
            onClick={() => {
              uploadEmo('third');
            }}
          >
            🙄
          </button>
          <button
          className="p-2 mx-2 "
            onClick={() => {
              uploadEmo('fourth');
            }}
          >
            😡
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChallengeImage;
