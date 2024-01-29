import { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';
import axios from 'axios';


function ChallengeImage() {
  const dispatch = useDispatch();
  const emotionList: any = useRef<HTMLInputElement>(null);

  const [first, setFirst] = useState(0);
  const [second, setSecond] = useState(0);
  const [third, setThird] = useState(0);
  const [fourth, setFourth] = useState(0);

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '인증 사진', backPath: -1 }));
  }, [dispatch]);


  useEffect(() => {
    axios.get('http://43.201.22.60:3000//challengeAuth/:challenge_id/:authentication_id')
    .then((response) => {console.log(response.data)}).
    catch((error):void=>{
      console.error('ChallengeImage에서  오류발생 :', error)
    })
  },[])

  function addEmotion(emotion: any) {
    switch (emotion) {
      case 'first':
        setFirst(first + 1);
        break;
      case 'second':
        setSecond(second + 1);
        break;
      case 'third':
        setThird(third + 1);
        break;
      case 'fourth':
        setFourth(fourth + 1);

        break;
    }

    emotionList.current.style.display = 'none';
  }

  function showEmotion() {
    console.log(emotionList.current);
    emotionList.current.style.display = 'block';
  }
  return (
    <div className="flex flex-col gap-8">
      <div>
        <img src="https://health.chosun.com/site/data/img_dir/2023/07/17/2023071701753_0.jpg"></img>
        <button onClick={showEmotion}>+</button>
        <div className="flex flex-row" ref={emotionList} style={{ display: 'none' }}>
          <button
            onClick={() => {
              addEmotion('first');
            }}
          >
            😀
          </button>
          <button
            onClick={() => {
              addEmotion('second');
            }}
          >
            ❤
          </button>
          <button
            onClick={() => {
              addEmotion('third');
            }}
          >
            😢
          </button>
          <button
            onClick={() => {
              addEmotion('fourth');
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
