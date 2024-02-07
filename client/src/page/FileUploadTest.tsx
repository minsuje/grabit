import { privateApi } from '@/api/axios';
import { useEffect, useState } from 'react';

function FileUploadTest() {
  const [file, setFile] = useState<File>();
  const [profile, setProfile] = useState<string>('');

  useEffect(() => {
    handleGet();
  }, []);

  async function handleUpload() {
    await privateApi({
      method: 'post',
      url: '/challengeAuth/1',
      data: {
        filename: file?.name,
        type: file?.type,
      },
    }).then((res) => {
      privateApi({
        method: 'put',
        url: res.data,
        data: file,
        headers: {
          'Content-Type': file?.type,
        },
      });
    });
  }

  async function handleUpdate() {
    await privateApi({
      method: 'patch',
      url: '/challengeAuth/1/77',
      data: {
        filename: file?.name,
        type: file?.type,
      },
    }).then((res) => {
      privateApi({
        method: 'put',
        url: res.data,
        data: file,
        headers: {
          'Content-Type': file?.type,
        },
      });
    });
  }

  async function handleGet() {
    await privateApi({
      method: 'get',
      url: '/challengeAuth/1/77',
    }).then((res) => {
      res.data;
      setProfile(res.data.fileUrl);
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files![0]);
  }

  async function handleDelete() {
    await privateApi({
      method: 'delete',
      url: '/challengeAuth/1/77',
    }).then(() => {
      alert('삭제 완료!');
    });
  }

  return (
    <div>
      <img src={profile} width={450} />
      <input type="file" onChange={handleChange} />
      <br />
      <br />
      <div className="flex gap-2">
        <button onClick={handleUpload} className="rounded-md bg-blue-500 p-3 text-white">
          업로드
        </button>
        <br />
        <button onClick={handleUpdate} className="rounded-md bg-blue-500 p-3 text-white">
          업데이트
        </button>
        <br />
        <button onClick={handleDelete} className="rounded-md bg-blue-500 p-3 text-white">
          삭제
        </button>
      </div>
    </div>
  );
}

export default FileUploadTest;
