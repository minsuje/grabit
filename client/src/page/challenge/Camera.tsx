import { Tab } from '@/components/Component0117';
import { useDispatch, useSelector } from 'react-redux';
import { ListComponent1, ProgressComponent } from '@/components/ComponentSeong';
import { RootState } from '@/store/store';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, RefObject } from 'react';
import axios from 'axios';
import { Challenge, users } from '@/types/types';
import { setTotalAuth, setResult } from '@/store/resultSlice';
import { setHeaderInfo } from '@/store/headerSlice';
import { differenceInDays, differenceInCalendarDays } from 'date-fns';
import { privateApi } from '@/api/axios';
// import Cta from '@/components/Cta';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import Cta from '@/components/Cta';

interface url {
  userid_num?: string;
  url: string;
  authentication_id?: number;
}
function Camera() {
  const info = useSelector((state: RootState) => state.result);
  console.log(info);

  // const { userid_num } = useSelector((state: RootState) => state.login);
  const userid_num = Number(localStorage.getItem('userid_num'));
  console.log('user', userid_num);

  const [file, setFile] = useState<File>();

  const [imgUrl, setImgUrl] = useState<string>();

  const inputRef: RefObject<HTMLInputElement> | null = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { challenge_id } = useParams();

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '진행중인 챌린지', backPath: -1 }));
  }, [dispatch]);

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

    await privateApi({
      method: 'post',
      url: `http://3.34.122.205:3000/challengeAuth/${challenge_id}`,
      data: {
        filename: file?.name,
        type: file?.type,
      },
    }).then((res) => {
      console.log('res.data>>>>>>>>>>', res.data);

      if (res.data.msg) {
        alert(res.data.msg);
      }
      // } else {
      //   axios({
      //     method: 'put',
      //     url: res.data,
      //     data: file,
      //     headers: {
      //       'Content-Type': file?.type,
      //     },
      //   }).then((res) => {
      //     console.log(res);
      //     alert('업로드 완료!');
      //     navigate(`/challengeInProgress/${challenge_id}`);
      //   });
      // }
    });
    if (imgUrl) {
      URL.revokeObjectURL(imgUrl);
      setImgUrl(undefined);
    }

    setFile(undefined);
  }

  return (
    <div className="mt-12 flex flex-col gap-4">
      {imgUrl && (
        <div className="mx-auto text-center">
          <img src={imgUrl}></img>
          <Button onClick={upload}>업로드</Button>
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

export default Camera;
