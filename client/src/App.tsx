import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Main from './page/challenge/Main';
import Main2 from './page/challenge/Main2';
import ChallengeInProgress from './page/challenge/ChallengeInProgress';
import Home from './page/home/Home';
import Register from './page/home/Register';
import Login from './page/home/Login';
import ChallengeNotice from './page/challenge/ChallengeNotice';
import ChallengeCreate from './page/challenge/ChallengeCreate';
import ChallengeResult from './page/challenge/ChallengeResult';
import ChallengeImage from './page/challenge/ChallengeImage';
import ChallengeList from './page/challenge/ChallengeList';
import ChallengeEdit from './page/challenge/ChallengeEdit';
import ChallengeDetail from './page/challenge/ChallengeDetail';
import ChallengeDaily from './page/challenge/ChallengeDaily';

import MyPageEdit from './page/myPage/MyPageEdit';
import MyPage from './page/myPage/MyPage';
import '@/App.css';
import Alarm from './page/home/Alarm';
import ChallengeAccept from './page/challenge/ChallengeAccept';

import FollowList from './page/myPage/FollowList';

import FileUploadTest from './page/FileUploadTest';
import FriendSelect from './page/myPage/FriendSelect';
import Test from './page/challenge/Test';



import Layout from './page/Layout';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route path="/main" element={<Main />} />
            <Route path="/main2" element={<Main2 />} />
            <Route path="/challengeInProgress/:challenge_id" element={<ChallengeInProgress />} />
            <Route path="/register/normal" element={<Register />} />
            {/* <Route path="/challengetear" element={<ChallengeTear />} /> */}
            <Route path="/challengeresult" element={<ChallengeResult />} />
            <Route path="/challengeImage/:authentication_id" element={<ChallengeImage />} />
            <Route path="/challengeList" element={<ChallengeList />} />
            <Route path="/challengeEdit/:challenge_id" element={<ChallengeEdit />} />
            <Route path="/challengeDetail/:challenge_id" element={<ChallengeDetail />} />
            <Route path="/challengeDaily/:mission_id" element={<ChallengeDaily />} />
            <Route path="/alarm" element={<Alarm />} />
            <Route path="/challengeAccept/:challenge_id" element={<ChallengeAccept />} />
            <Route path="/fileupload" element={<FileUploadTest />} />
            <Route path="/friendSelect" element={<FriendSelect />} />
            <Route path="/challengeResult/:challenge_id" element={<ChallengeResult />} />
            <Route path="/challengeNotice" element={<ChallengeNotice />} />
            <Route path="/challengeCreate" element={<ChallengeCreate />} />
            <Route path="/mypage/" element={<MyPage />} />
            <Route path="/mypage/:mypageedit" element={<MyPageEdit />} />
            <Route path="/followlist" element={<FollowList />} />
            
            {/* 테스트 용 */}
                    <Route path="/test" element={<Test />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
