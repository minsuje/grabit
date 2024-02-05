import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useRef, useState, RefObject } from 'react';
import OpenAI from 'openai';
import { setHeaderInfo } from '@/store/headerSlice';
import { Button } from '@/components/ui/button';
import { privateApi } from '@/api/axios';

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
      .get('http://52.79.228.200:3000/dailyMission', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
      })
      .then((response) => {
        console.log('dailyMission >>>>>>>', response.data);
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
    console.log('파일 변환 실행');
    const file = event.target.files?.[0];
    if (file) {
      convertToBase64(file);
    }
    console.log(file);
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
              text: `배열 ${keyword} 에 존재하는 키워드를 4개 추출해서, 이미지에 해당 키워드가 한개 이상  존재하는지 true, false 로만 대답해. 다른 말은 하지마.`,
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
    console.log('openai >>>>>>>>>>', response.choices[0]);
    if (response?.choices[0].message.content == 'True' || response?.choices[0].message.content?.includes('True')) {
      console.log('보내기');
      privateApi
        .patch(`http://52.79.228.200:3000/dailyMissionAuth`)
        .then((response): void => {
          console.log('response', response.data);
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
      <div className="p-3 text-center text-5xl font-extrabold">데일리 미션</div>

      <div className="text-center">
        <p>오늘의 미션을 완료하고</p>
        <p>추가 포인트를 얻으세요!</p>
        <div className="m-2   ">
          <p className="">오늘의 미션</p>
          <h1 className="text-center">{dailymission}</h1>
        </div>
      </div>

      {imgUrl ? (
        <div className="mx-auto text-center">
          <h1> 미리보기</h1>
          <img src={imgUrl}></img>
          <Button onClick={openaiFunction}>업로드</Button>
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
