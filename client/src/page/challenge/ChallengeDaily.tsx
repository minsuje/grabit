import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useRef, useState, RefObject } from 'react';
import OpenAI from 'openai';
import { setHeaderInfo } from '@/store/headerSlice';
import { Button } from '@/components/ui/button';
import { privateApi } from '@/api/axios';
import Cta from '@/components/Cta';

function ChallengeDaily() {
  const [dailymission, setDailymission] = useState<string>('');
  // const [file, setFile] = useState<File>();
  const [keyword, setKeyword] = useState<string[]>([]);
  const [imgUrl, setImgUrl] = useState<string>();
  const [imageBase64, setImageBase64] = useState('');
  const inputRef: RefObject<HTMLInputElement> | null = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    privateApi
      .get('/dailyMission')
      .then((response) => {
        setDailymission(response.data.mission.title);
        setKeyword(response.data.mission.topic);
      })
      .catch((error) => {
        console.error('main에서 일일미션 오류발생 :', error);
      });
  }, []);

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '오늘의 미션', backPath: '/main' }));
  }, [dispatch]);

  // Function to convert image to base64
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
              text: `배열 ${keyword} 에 존재하는 키워드를 4개 추출해서, 이미지에 해당 키워드가 한개 이상 존재하는지 true, false 로만 대답해. 4개 중 하나만 true여도 하나의 true 값을 반환하고, 4개 중 하나도 존재하지 않으면 하나의 false 값을 반환해줘. 다른 말은 하지마.`,
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
    if (response?.choices[0].message.content == 'True' || response?.choices[0].message.content?.includes('True')) {
      privateApi
        .patch(`/dailyMissionAuth`)
        .then((response): void => {
          if (response.data.msg) {
            alert(response.data.msg);
            window.location.href = '/main';
          }
        })
        .catch((error): void => {
          console.error('Challengeinprogress에서 axios 오류:', error);
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
    <div className="flex flex-col gap-4">
      <h1 className="font-extrabold">데일리 미션</h1>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <p className="flex text-stone-400">오늘의 미션을 완료하고</p>
          <p className="flex text-stone-400">추가 포인트를 얻으세요!</p>
        </div>
        <div className="flex w-full flex-col gap-2 rounded-xl bg-grabit-100 p-4 text-center">
          <p className="">오늘의 미션</p>
          <h1 className="text-center">{dailymission}</h1>
        </div>
      </div>

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
                // setFile(e.target.files[0]);
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
export default ChallengeDaily;
