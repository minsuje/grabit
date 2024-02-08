import { ListComponent1 } from '@/components/ComponentSeong';
import { Link } from 'react-router-dom';
import { ListComponentWithoutButton, ListComponentWithButton } from '@/components/PreChallenge';
import { privateApi } from '@/api/axios';
import { useEffect, useState } from 'react';
import { Challenge } from '@/types/types';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';

function ChallengeList() {
  // const { userid_num } = useSelector((state: RootState) => state.login);
  const userid_num = localStorage.getItem('userid_num');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '챌린지 목록', backPath: '/main' }));
  }, [dispatch]);

  const [ingMyChallenge, setIngMyChallenge] = useState<Challenge[]>([]);
  const [preMyChallenge, setPreMyChallenge] = useState<Challenge[]>([]);
  const [publicChallenge, setPublicChallenge] = useState<Challenge[]>([]);

  // const { accessToken, refreshToken } = useSelector((state: RootState) => state.login);

  useEffect(() => {
    {
      privateApi
        .get('/challengeList')
        .then((response) => {
          setIngMyChallenge(response.data.ingMyChallenge);
          setPreMyChallenge(response.data.preMyChallenge);
          setPublicChallenge(response.data.prePublicChallenge);
        })
        .catch((error) => {
          console.error('ChallengeList에서  오류발생 :', error);
        });
    }
    // privateApi({
    //   method: 'GET',
    //   url: '/challengeList',
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // });
  }, []);

  return (
    <div className="mt-8 flex flex-col gap-12">
      <h1>참여중인 챌린지</h1>
      <div className="flex flex-col gap-4">
        {ingMyChallenge.map((challenge: Challenge) => {
          return (
            <Link to={`/challengeInProgress/${challenge.challenge_id}`} className=" text-black no-underline">
              <ListComponent1 challenge={challenge} />
            </Link>
          );
        })}
      </div>

      <h1>참가 예정 챌린지</h1>

      <div className="flex flex-col gap-4">
        {preMyChallenge.map((challenge: Challenge) => {
          return (
            <>
              {Number(challenge.userid_num) === Number(userid_num) ? (
                <>
                  <ListComponentWithButton challenge={challenge} />
                </>
              ) : (
                <>
                  <ListComponentWithoutButton challenge={challenge} />
                </>
              )}
            </>
          );
        })}
      </div>

      <h1>공개 챌린지</h1>

      <div className="flex flex-col gap-4">
        {publicChallenge.map((challenge: Challenge) => {
          return <ListComponentWithoutButton challenge={challenge} />;
        })}
      </div>
    </div>
  );
}
export default ChallengeList;
