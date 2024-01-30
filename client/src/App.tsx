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

import '@/App.css';
import Alarm from './page/home/Alarm';
import ChallengeAccept from './page/challenge/ChallengeAccept';

// MyPage
import MyPage from './page/myPage/MyPage';
import MyPageEdit from './page/myPage/MyPageEdit';
import Friend from './page/myPage/Friend';
import MypageWithdraw from './page/myPage/MyPageWithdraw';
import MypageCharge from './page/myPage/MyPageCharge';
import MyPageHistory from './page/myPage/MyPageHistory';
import MyPageHistoryDetail from './page/myPage/MyPageHistoryDetail';

import FileUploadTest from './page/FileUploadTest';
import FriendSelect from './page/myPage/FriendSelect';
import Test from './page/challenge/Test';

import Layout from './page/Layout';
import CommonLayout from './page/CommonLayout';

import Camera from './page/challenge/Camera';
import Refresh from './page/home/Refresh';
import ChallengeTier from './page/challenge/ChallengeTier';
import MyPageFriendDetail from './page/myPage/MyPageFriendDetail';
import FriendAddition from './page/myPage/FriendAddition';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<CommonLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register/normal" element={<Register />} />
          </Route>
          <Route element={<Layout />}>
            <Route index path="/main" element={<Main />} />
            <Route path="/main2" element={<Main2 />} />
            <Route path="/challengeInProgress/:challenge_id" element={<ChallengeInProgress />} />
            <Route path="/camera/:challenge_id" element={<Camera />} />

            {/* <Route path="/challengetear" element={<ChallengeTear />} /> */}
            <Route path="/challengeresult" element={<ChallengeResult />} />
            <Route path="/challengeImage/:challenge_id/:authentication_id" element={<ChallengeImage />} />
            <Route path="/challengeList" element={<ChallengeList />} />
            <Route path="/challengeEdit/:challenge_id" element={<ChallengeEdit />} />
            <Route path="/challengeDetail/:challenge_id" element={<ChallengeDetail />} />
            <Route path="/challengeDaily/:mission_content" element={<ChallengeDaily />} />
            <Route path="/alarm" element={<Alarm />} />
            <Route path="/challengeAccept/:challenge_id" element={<ChallengeAccept />} />
            <Route path="/fileupload" element={<FileUploadTest />} />
            <Route path="/friendSelect" element={<FriendSelect />} />
            <Route path="/challengeResult/:challenge_id" element={<ChallengeResult />} />
            <Route path="/challengeNotice" element={<ChallengeNotice />} />
            <Route path="/challengeCreate" element={<ChallengeCreate />} />

            <Route path="/refresh" element={<Refresh />} />

            <Route path="/challengetier" element={<ChallengeTier />} />

            {/* mypage */}
            <Route path="/mypage/:id" element={<MyPage />} />
            <Route path="/:id/mypageedit" element={<MyPageEdit />} />
            <Route path="/mypage/myPagewithdraw" element={<MypageWithdraw />} />
            <Route path="/mypage/mypagecharge" element={<MypageCharge />} />
            <Route path="/mypage/friend/detail/:id/" element={<Friend />} />

            <Route path="/friend/:id" element={<MyPageFriendDetail />} />
            <Route path="/mypage/mypagefrienddetail" element={<MyPageFriendDetail />} />
            <Route path="/mypage/mypagehistory" element={<MyPageHistory />} />
            <Route path="/mypagehistorydetail/:id" element={<MyPageHistoryDetail />} />
            <Route path="/friend/new" element={<FriendAddition />} />

            <Route path="/friend/new" element={<FriendAddition />} />
          </Route>

          {/* 테스트 용 */}
          <Route path="/test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
