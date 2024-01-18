import { HotChallenge, Ranking } from '@/components/Component0117';
import { ListComponent1 } from '@/components/ComponentSeong';
import { Button } from '@/components/ui/button';
export interface challengeData {
    challenge_num: number;
    challengeName: string;
}

function Main() {
    const challengeData = [
        {
            challenge_num: 1,
            challengeName: '물마시기',
        },
    ];
    return (
        <div className="container">
            <h1>랭킹</h1>
            <Ranking />


            <h1>진행중인 챌린지</h1>
            {challengeData.map((challenge) => {
                return <ListComponent1 key={challenge.challenge_num} challengeList={challenge} />;
            })}
            <ListComponent1 />


            <h1>지금 인기있는 주제</h1>
            <HotChallenge />

            <div className="text-right p-3">
                <Button>챌린지 생성</Button>
            </div>
        </div>
    );
}
export default Main;
