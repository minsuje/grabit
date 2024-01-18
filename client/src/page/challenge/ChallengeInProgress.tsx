import { Tab } from '@/components/Component0117';
import { ListComponent1, ProgressComponent } from '@/components/ComponentSeong';
import { Button } from '@/components/ui/button';

function ChallengeInProgress() {
    return (
        <div className="container">
            <div className="text-center font-extrabold text-5xl p-3">30,000 원</div>

            <div className="grid grid-cols-2 gap-4 text-center p-1 m-10">
                <div className="font-black text-2xl">나</div>
                <div className="font-black text-2xl">상대</div>
                <div>3회 성공</div>
                <div>5회 성공</div>
            </div>
            <ProgressComponent />
            <ProgressComponent />
            <br />
            <ListComponent1 />

            <Tab />
            <div className="text-center ">
                <Button>인증하기</Button>
            </div>
        </div>
    );
}
export default ChallengeInProgress;
