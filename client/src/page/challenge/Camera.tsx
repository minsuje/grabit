import { useDispatch } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useEffect, useState, RefObject } from 'react';
import OpenAI from 'openai';
import { setHeaderInfo } from '@/store/headerSlice';
import { privateApi } from '@/api/axios';
// import Cta from '@/components/Cta';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import axios from '@/api/axios';
import Cta from '@/components/Cta';

function Camera() {
  const location = useLocation();
  const { state } = location;
  const { keyword, name } = state;

  // const { userid_num } = useSelector((state: RootState) => state.login);
  const [imgUrl, setImgUrl] = useState<string>();
  const [fileData, setFileData] = useState<File>();
  const [imageBase64, setImageBase64] = useState('');
  const inputRef: RefObject<HTMLInputElement> | null = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { challenge_id } = useParams();

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '진행중인 챌린지', backPath: -1 }));
  }, [dispatch]);

  const convertToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageBase64(reader.result as string);
    };
    reader.onerror = (error) => {
      console.error('Error converting image to Base64', error);
    };
  };

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      convertToBase64(file);
    }
  };

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  async function openaiFunction() {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: ` ${keyword} 와 관련있는 키워드를 추출해서, 이미지에 해당 키워드가 존재하는지 true, false 로만 대답해. 다른 말은 하지마.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageBase64,
              },
            },
          ],
        },
      ],
    });
    if (response?.choices[0].message.content?.includes('True')) {
      await privateApi({
        method: 'post',
        url: `/challengeAuth/${challenge_id}`,
        data: {
          filename: fileData?.name,
          type: fileData?.type,
        },
      }).then((res) => {
        if (res.data.msg) {
          alert(res.data.msg);
        } else {
          axios({
            method: 'put',
            url: res.data,
            data: fileData,
            headers: {
              'Content-Type': fileData?.type,
            },
          }).then(() => {
            alert('업로드 완료!');
            navigate(`/challengeInProgress/${challenge_id}`);
          });
        }
      });
      if (imgUrl) {
        URL.revokeObjectURL(imgUrl);
        setImgUrl(undefined);
      }
    } else {
      alert('인증 기준에 맞지 않습니다. 다시 인증해주세요');
    }
  }

  return (
    <div className="mt-12 flex flex-col gap-4">
      <h1>{name}</h1>

      {imgUrl ? (
        <div className="mx-auto my-6 text-center">
          <h1> 미리보기</h1>
          <img src={imgUrl}></img>
        </div>
      ) : (
        <div
          className=" m-2 mx-auto flex h-40 w-full flex-col justify-center rounded-md border-2  border-gray-400 text-center  text-gray-400 hover:cursor-pointer"
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
                setFileData(e.target.files[0]);
                setImgUrl(URL.createObjectURL(e.target.files[0]));
                handleFileChange(e);
              }
            }}
          />
          {!imgUrl ? (
            <Cta
              text={'인증하기'}
              onclick={() => {
                if (inputRef.current) {
                  inputRef.current.click();
                }
              }}
            />
          ) : (
            <>
              <Button
                onClick={() => {
                  if (inputRef.current) {
                    inputRef.current.click();
                  }
                }}
                className="my-2 w-full p-5"
              >
                다시 찍기
              </Button>
              <Button onClick={openaiFunction} className="w-full p-5">
                업로드
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Camera;
