import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

function ChallengeNotice() {
    const [confirm, setConfirm] = useState<boolean>(false);

    function handleSubmit() {
        if (confirm) {
            console.log('챌린지 참여');
        } else {
            console.log('챌린지 참여 안함');
        }
    }

    return (
        <div className="container flex flex-col">
            <div className="flex flex-col text">
                <h1 className="text-stone-600 font-bold">챌린지 참여 주의사항</h1>
                <p className="text-stone-500">챌린지 참여 시 수수료 3%가 적용됩니다</p>
                <p className="text-stone-500">수수료 3%는 서비스 운영에 이용됩니다</p>
            </div>

            <div className="bottom fixed bottom-0 p-4 left-0 right-0">
                <div className="check flex gap-2">
                    <Checkbox id="terms" checked={confirm} onCheckedChange={setConfirm} />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        확인했습니다
                    </label>
                </div>
                <br />
                {confirm ? (
                    <Button className="w-full" onClick={handleSubmit}>
                        챌린지 참여
                    </Button>
                ) : (
                    <Button className="w-full" onClick={handleSubmit} disabled>
                        챌린지 참여
                    </Button>
                )}
            </div>
        </div>
    );
}

export default ChallengeNotice;
