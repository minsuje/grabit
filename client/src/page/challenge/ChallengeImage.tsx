import { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';
import { privateApi } from '@/api/axios';
import { useParams } from 'react-router-dom';
import { authentication_img_emotion } from '@/types/types';

interface Emotion {
  count: number;
  checked: boolean;
}

function ChallengeImage() {
  const dispatch = useDispatch();
  const userid_num = Number(localStorage.getItem('userid_num'));
  // const userid_num = 3;

  const { challenge_id, authentication_id } = useParams();
  // const emotionList: any = useRef<HTMLInputElement>(null);
  const [emoticonArr, setEmoticonArr] = useState<authentication_img_emotion[]>([]);

  const [first, setFirst] = useState<Emotion>({
    count: 0,
    checked: false,
  });
  const [second, setSecond] = useState<Emotion>({
    count: 0,
    checked: false,
  });
  const [third, setThird] = useState<Emotion>({
    count: 0,
    checked: false,
  });
  const [fourth, setFourth] = useState<Emotion>({
    count: 0,
    checked: false,
  });
  const [fileUrl, setFileUrl] = useState<string>('');

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '인증 사진', backPath: -1 }));
  }, [dispatch]);

  useEffect(() => {
    privateApi
      .get(`http://localhost:3000/challengeAuth/${challenge_id}/${authentication_id}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response): void => {
        console.log(response.data);
        setFileUrl(response.data.fileUrl);
        setEmoticonArr(response.data.emoticon);
        for (let i = 0; i < response.data.emoticon.length; i++) {
          switch (response.data.emoticon[i].authentication_img_comment_emoticon) {
            case 1:
              setFirst({ ...first, count: (first.count += 0.5) });
              response.data.emoticon[i].authentication_img_comment_userid_num == userid_num &&
                setFirst({ ...first, checked: true });
              break;
            case 2:
              setSecond({ ...second, count: (second.count += 0.5) });
              response.data.emoticon[i].authentication_img_comment_userid_num == userid_num &&
                setSecond({ ...second, checked: true });
              break;
            case 3:
              setThird({ ...third, count: (third.count += 0.5) });
              response.data.emoticon[i].authentication_img_comment_userid_num == userid_num &&
                setThird({ ...third, checked: true });
              break;
            case 4:
              setFourth({ ...fourth, count: (fourth.count += 0.5) });
              response.data.emoticon[i].authentication_img_comment_userid_num == userid_num &&
                setFourth({ ...fourth, checked: true });
              break;
            default:
              break;
          }
        }
      })
      .catch((error): void => {
        console.error('ChallengeImage에서  오류발생 :', error);
      });
  }, []);

  function uploadEmo(emotion: string) {
    switch (emotion) {
      case 'first':
        if (first.checked) {
          setFirst({ count: first.count - 1, checked: false });
          console.log("first -1")
          privateApi
            .delete(`http://localhost:3000/challengeAuth/${challenge_id}/${authentication_id}/${1}`, {
              headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
            })
            .then((res) => console.log(res))
            .catch((err) => console.error(err));
        } else {
          setFirst({ count: first.count + 1, checked: true });
          console.log('frist +1')
          privateApi
            .post(`http://localhost:3000/challengeAuth/${challenge_id}/${authentication_id}`, {
              authentication_img_comment_emoticon: 1,
            })
            .then((res) => console.log(res))
            .catch((err) => console.error(err));
        }

        break;
      case 'second':
        if (second.checked) {
          setSecond({ count: second.count - 1, checked: false });
          privateApi
            .delete(`http://localhost:3000/challengeAuth/${challenge_id}/${authentication_id}/2`,{
              headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
            })
            .then((res) => console.log(res))
            .catch((err) => console.error(err));
        } else {
          setSecond({ count: second.count + 1, checked: true });
          privateApi
            .post(`http://localhost:3000/challengeAuth/${challenge_id}/${authentication_id}`, {
              authentication_img_comment_emoticon: 2,
            })
            .then((res) => console.log(res))
            .catch((err) => console.error(err));
        }
        break;
      case 'third':
        if (third.checked) {
          setThird({ count: third.count - 1, checked: false });
          privateApi
            .delete(`http://localhost:3000/challengeAuth/${challenge_id}/${authentication_id}/3`,{
              headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
            })
            .then((res) => console.log(res))
            .catch((err) => console.error(err));
        } else {
          setThird({ count: third.count + 1, checked: true });
          privateApi
            .post(`http://localhost:3000/challengeAuth/${challenge_id}/${authentication_id}`, {
              authentication_img_comment_emoticon: 3,
            })
            .then((res) => console.log(res))
            .catch((err) => console.error(err));
        }
        break;
      case 'fourth':
        if (fourth.checked) {
          setFourth({ count: fourth.count - 1, checked: false });
          privateApi
            .delete(`http://localhost:3000/challengeAuth/${challenge_id}/${authentication_id}/4`,{
              headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
            })
            .then((res) => console.log(res))
            .catch((err) => console.error(err));
        } else {
          setFourth({ count: fourth.count + 1, checked: true });
          privateApi
            .post(`http://localhost:3000/challengeAuth/${challenge_id}/${authentication_id}`, {
              authentication_img_comment_emoticon: 4,
            })
            .then((res) => console.log(res))
            .catch((err) => console.error(err));
        }
        break;
    }

    // axios.post(`XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX${challenge_id}/${authentication_id}`,{)
    // 누른 이모티콘 번호랑 userid ? 보내기
  }

  // function showEmotion() {
  //   if (emotionList.current.style.display === 'block') {
  //     emotionList.current.style.display = 'none';
  //   } else {
  //     emotionList.current.style.display = 'block';
  //   }
  // }
  return (
    <div className="flex flex-col gap-8">
      <h1> 인증 사진 </h1>
      <p> 이모티콘</p>
      <div className="flex flex-col justify-center">
        <img className="aspect-square w-full rounded-lg object-cover" src={fileUrl}></img>

        <div className="flex flex-row justify-around">
          {first.checked ? (
            <p
              className="my-2 rounded-md bg-fuchsia-200 px-2 hover:cursor-pointer"
              onClick={() => {
                uploadEmo('first');
              }}
            >
              😀 {first.count}
            </p>
          ) : (
            <p
              className="my-2 rounded-md bg-fuchsia-100 px-2 hover:cursor-pointer"
              onClick={() => {
                uploadEmo('first');
              }}
            >
              😀 {first.count}
            </p>
          )}

          {second.checked ? (
            <p
              className="my-2 rounded-md bg-fuchsia-200 px-2 hover:cursor-pointer"
              onClick={() => {
                uploadEmo('second');
              }}
            >
              🤣 {second.count}
            </p>
          ) : (
            <p
              className="my-2 rounded-md bg-fuchsia-100 px-2 hover:cursor-pointer"
              onClick={() => {
                uploadEmo('second');
              }}
            >
              🤣 {second.count}
            </p>
          )}
          {third.checked ? (
            <p
              className="my-2 rounded-md bg-fuchsia-200 px-2 hover:cursor-pointer"
              onClick={() => {
                uploadEmo('third');
              }}
            >
              🙄 {third.count}
            </p>
          ) : (
            <p
              className="my-2 rounded-md bg-fuchsia-100 px-2 hover:cursor-pointer"
              onClick={() => {
                uploadEmo('third');
              }}
            >
              🙄 {third.count}
            </p>
          )}
          {fourth.checked ? (
            <p
              className="my-2 rounded-md bg-fuchsia-200 px-2 hover:cursor-pointer"
              onClick={() => {
                uploadEmo('fourth');
              }}
            >
              😡 {fourth.count}
            </p>
          ) : (
            <p
              className="my-2 rounded-md bg-fuchsia-100 px-2 hover:cursor-pointer"
              onClick={() => {
                uploadEmo('fourth');
              }}
            >
              😡 {fourth.count}
            </p>
          )}
        </div>
        {/* <button onClick={showEmotion}>🔻</button>
        <div className="flex flex-row" ref={emotionList} style={{ display: 'none' }}>
          <button
            className="mx-2 p-2 "
            onClick={() => {
              uploadEmo('first');
            }}
          >
            😀
          </button>

          <button
            className="mx-2 p-2 "
            onClick={() => {
              uploadEmo('second');
            }}
          >
            🤣
          </button>
          <button
            className="mx-2 p-2 "
            onClick={() => {
              uploadEmo('third');
            }}
          >
            🙄
          </button>
          <button
            className="mx-2 p-2 "
            onClick={() => {
              uploadEmo('fourth');
            }}
          >
            😡
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default ChallengeImage;
