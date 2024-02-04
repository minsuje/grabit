import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRef, useState, RefObject } from 'react';

import { setHeaderInfo } from '@/store/headerSlice';
import { RootState } from '@/store/store';
import { Button } from '@/components/ui/button';
import { privateApi } from '@/api/axios';

function ChallengeDaily() {
  const { userid_num } = useSelector((state: RootState) => state.login);
  console.log('user', userid_num);
  const [file, setFile] = useState<File>();
  const [imgUrl, setImgUrl] = useState<string>();
  const inputRef: RefObject<HTMLInputElement> | null = useRef(null);
  const dispatch = useDispatch();
  const { mission_content } = useParams();

  async function query(file: File) {
    const response = await fetch('https://api-inference.huggingface.co/models/facebook/detr-resnet-50', {
      headers: { Authorization: import.meta.env.VITE_HUGGING_FACE_TOKEN },
      method: 'POST',
      body: file,
    });
    const result = await response.json();
    return result;
  }

  async function upload() {
    if (file) {
      const aiFile = await query(file);
      console.log('aifile >>>>>>', aiFile);
    }

    // privateApi
    //   .patch(`http://3.34.122.205:3000/dailyMissionAuth`)
    //   .then((response): void => {
    //     console.log('response', response.data);
    //     if (response.data.msg) {
    //       alert(response.data.msg);
    //       window.location.href = '/main';
    //     }
    //   })
    //   .catch((error): void => {
    //     console.error('Challengeinprogress에서 axios 오류:', error);
    //   });

    if (imgUrl) {
      URL.revokeObjectURL(imgUrl);
      setImgUrl(undefined);
    }

    setFile(undefined);
  }

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '오늘의 미션', backPath: '/main' }));
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-4">
      <div className="p-3 text-center text-5xl font-extrabold">데일리 미션</div>

      <div className="text-center">
        <p>오늘의 미션을 완료하고</p>
        <p>추가 포인트를 얻으세요!</p>
        <div className="m-2   ">
          <p className="">오늘의 미션</p>
          <h1 className="text-center">{mission_content}</h1>
        </div>
      </div>

      {imgUrl ? (
        <div className="mx-auto text-center">
          <h1> 미리보기</h1>
          <img src={imgUrl}></img>
          <Button onClick={upload}>업로드</Button>
        </div>
      ) : (
        <div
          className=" m-2 mx-auto flex h-40 w-full flex-col justify-center rounded-md border-2  border-gray-400 text-center  text-gray-400"
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.click();
            }
          }}
        >
          <p>+</p>
          <p>사진 찍기</p>
        </div>
      )}

      <div className="cta fixed bottom-0 left-0 right-0 flex flex-col">
        <div className="flex h-8 bg-gradient-to-b from-transparent to-white"></div>
        <div className="flex-col bg-white px-8  pb-8 ">
          <input
            className="opacity-0"
            type="file"
            id="imageFile"
            capture="environment"
            accept="image/*"
            ref={inputRef}
            onChange={(e) => {
              if (e.target.files?.length == 1) {
                console.log(e.target.files[0]);
                setFile(e.target.files[0]);
                setImgUrl(URL.createObjectURL(e.target.files[0]));
              }
            }}
          />
          <Button
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.click();
              }
            }}
            className="w-full rounded-md p-6"
          >
            인증하기
          </Button>
        </div>
      </div>
    </div>
  );
}
export default ChallengeDaily;
