import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Main from './page/challenge/Main';

import ChallengeInProgress from './page/challenge/ChallengeInProgress';
import Home from './page/home/Home';
import Register from './page/home/Register';
import Login from './page/home/Login';
import KakaoAuth from './page/home/KakaoAuth';

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
// import Test from './page/challenge/Test';

import Layout from './page/Layout';
import CommonLayout from './page/CommonLayout';

import Camera from './page/challenge/Camera';
import Refresh from './page/home/Refresh';
import ChallengeTier from './page/challenge/ChallengeTier';
import MyPageFriendDetail from './page/myPage/MyPageFriendDetail';
import FriendAddition from './page/myPage/FriendAddition';

import CheckoutPages from './page/CheckoutPage';
import CheckoutSuccess from './page/CheckoutSuccess';
import CheckoutFail from './page/CheckoutFail';
import Payment from './page/Payment';
import { useState } from 'react';
import ScrollToTop from './components/ScrollTop';
import { AnimatePresence } from 'framer-motion';
import AnimatedRootRoutes from './page/AnimatedRootRoutes';
import Error404 from './page/Error404';

import PageChangeTracker from './PageChangeTracker';

function AnimatedRoutes() {
  const [price, setPrice] = useState<number>(0);
  PageChangeTracker();

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route element={<AnimatedRootRoutes />}>
          <Route path="/" element={<Home />} />
          <Route element={<CommonLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register/normal" element={<Register />} />
            <Route path="/auth/kakao/login" element={<KakaoAuth />} />
          </Route>
        </Route>
        <Route element={<Layout />}>
          <Route index path="/main" element={<Main />} />
          <Route path="/challengeInProgress/:challenge_id" element={<ChallengeInProgress />} />
          <Route path="/camera/:challenge_id" element={<Camera />} />
          {/* <Route path="/challengetear" element={<ChallengeTear />} /> */}

          <Route path="/challengeImage/:challenge_id/:authentication_id" element={<ChallengeImage />} />
          <Route path="/challengeList" element={<ChallengeList />} />
          <Route path="/challengeEdit/:challenge_id" element={<ChallengeEdit />} />
          <Route path="/challengeDetail/:challenge_id" element={<ChallengeDetail />} />

          <Route path="/challengeDaily" element={<ChallengeDaily />} />

          <Route path="/alarm" element={<Alarm />} />
          <Route path="/challengeAccept/:challenge_id" element={<ChallengeAccept />} />
          <Route path="/fileupload" element={<FileUploadTest />} />
          <Route path="/friendSelect" element={<FriendSelect />} />

          <Route path="/challengeNotice" element={<ChallengeNotice />} />
          <Route path="/challengeCreate" element={<ChallengeCreate />} />
          <Route path="/refresh" element={<Refresh />} />
          <Route path="/challengetier" element={<ChallengeTier />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/edit" element={<MyPageEdit />} />
          <Route path="/mypage/withdraw" element={<MypageWithdraw />} />
          <Route path="/mypage/charge" element={<MypageCharge />} />
          <Route path="/mypage/friend" element={<Friend />} />
          <Route path="/friend/:userid" element={<MyPageFriendDetail />} />
          <Route path="/mypage/mypagefrienddetail" element={<MyPageFriendDetail />} />
          <Route path="/mypage/history/:userid_num" element={<MyPageHistory />} />
          <Route path="/mypage/historydetail/:userid_num" element={<MyPageHistoryDetail />} />
          <Route path="/payment" element={<Payment price={price} setPrice={setPrice} />} />
          <Route path="/checkout" element={<CheckoutPages price={price} />} />
          <Route path="/friend/new/:userid" element={<FriendAddition />} />
          <Route path="/friend/new" element={<FriendAddition />} />
        </Route>
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/checkout/fail" element={<CheckoutFail />} />

        {/* <Route path="/challengeresult" element={<ChallengeResult />} /> */}
        <Route path="/challengeResult/:challenge_id" element={<ChallengeResult />} />

        <Route path={'*'} element={<Error404 />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <AnimatedRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
