import { HotChallenge, Ranking } from '@/components/Component0117';
import { ListComponent1 } from '@/components/ComponentSeong';
import { Button } from '@/components/ui/button';

function Main() {
    return (
        <div className="container">
            <div className="font-bold text-xl p-2">랭킹</div>
            <Ranking />

            <div className="font-bold text-xl p-2">진행중인 챌린지</div>
            <ListComponent1 />
            {/* <ListComponent1 />
            <ListComponent1 /> */}

            <HotChallenge />

            <div className="text-right p-3">
                <Button>챌린지 생성</Button>
            </div>
        </div>
    );
}
export default Main;
