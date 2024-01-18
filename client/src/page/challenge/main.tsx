import { HotChallenge, Ranking } from '@/components/Component0117';
import { ListComponent1 } from '@/components/ComponentSeong';
import { Button } from '@/components/ui/button';
import ChallengeData from '../../data/ChallengeData';



function Main() {
    return (
        <div className="container">
            <h1>랭킹</h1>
            <Ranking />

            <h1>진행중인 챌린지</h1>

            {ChallengeData.map((challenge) => {
                return (
                    <Link to={`/challengeInProgress/${challenge.challenge_num}`}>
                        <ListComponent1 challenge={challenge} />
                    </Link>
                );
            })}

            <h1>지금 인기있는 주제</h1>
            <HotChallenge />

            <div className="text-right p-3">
                <Link to="/challengeCreate">
                    <Button>챌린지 생성</Button>
                </Link>
            </div>
        </div>
    );
}
export default Main;
