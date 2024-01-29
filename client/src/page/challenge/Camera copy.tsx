import { ChangeEvent, useState } from 'react';
import { CameraAction } from '../../camera/camera';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Camera() {
  const navigate = useNavigate();
  const [isCameraOpen, setIsCameraOpen] = useState<Boolean>(false);
  const [cardImage, setCardImage] = useState<Blob>();
  const [file, setFile] = useState<File>();
  const [uploadFile, setUploadFile] = useState<File | undefined>();

  const { challenge_id } = useParams();

  // handleFile function
  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files?.['0'];
    console.log('🚀 ~ handleFile ~ files:', files);
    console.log('🚀 ~ handleFile ~ files:', typeof files);
    if (files) {
      setUploadFile(files);
    }
  }

  async function upload() {
    const formData = new FormData();

    console.log('uploadFile ', typeof uploadFile);

    if (uploadFile) {
      formData.append('file', uploadFile);
    }

    // if (uploadFile) {
    //   for (let i = 0; i < uploadFile.length; i++) {
    //     formData.append('file', uploadFile[i]);
    //   }
    // }

    // console log inside formData
    for (const key of formData.keys()) {
      console.log(key, formData.get(key));
    }

    await axios({
      method: 'post',
      url: `http://localhost:3000/challengeAuth/${challenge_id}`,

      data: {
        filename: file?.name,
        type: file?.type,
        formData,
      },
      headers: {
        'Context-Type': 'multipart/form-data',
      },
    }).then((res) => {
      console.log('res.data', res.data);
      if (res.data.msg) {
        alert(res.data.msg);
      } else {
        axios({
          method: 'put',
          url: res.data,
          data: file,
          headers: {
            'Content-Type': file?.type,
          },
        }).then((res) => {
          console.log(res);
          alert('업로드 완료!');
          navigate(`/challengeInProgress/${challenge_id}`);
        });
      }
    });
  }

  return (
    <>
      <div className="flex-col align-middle">
        <div>
          {!cardImage && isCameraOpen && (
            <CameraAction
              onCapture={(blob: Blob) => {
                setCardImage(blob);
                console.log('blob', blob);
                setFile(new File([blob], 'image.png', { type: blob.type }));
              }}
              onClear={() => setCardImage(undefined)}
            />
          )}
        </div>

        <input type="file" onChange={handleFile} />
        <Button onClick={upload}>업로드</Button>

        {cardImage && (
          <div className="m-auto">
            {/* <h2>미리보기</h2> */}

            <img className="absolute" src={cardImage && URL.createObjectURL(cardImage)} />

            <div className="absolute">
              <Button
                onClick={() => {
                  setIsCameraOpen(true);
                  setCardImage(undefined);
                }}
              >
                다시 찍기
              </Button>
              <Button onClick={upload}>업로드</Button>
            </div>
          </div>
        )}
        <div className="fixed bottom-0 left-0 right-0 flex justify-center align-middle">
          <Button onClick={() => setIsCameraOpen(true)}>Open Camera</Button>
          <Button
            onClick={() => {
              setIsCameraOpen(false);
              setCardImage(undefined);
              console.log(isCameraOpen);
            }}
          >
            Close Camera
          </Button>
        </div>
      </div>
    </>
  );
}

export default Camera;
