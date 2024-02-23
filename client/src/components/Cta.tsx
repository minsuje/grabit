import { Button } from './ui/button';

function Cta({ text, onclick, disabled }: { text: string; onclick: () => void; disabled?: boolean }) {
  return (
    <div className="cta fixed bottom-0 left-0 right-0 flex flex-col">
      <div className="flex h-8 bg-gradient-to-b from-transparent to-grabit-50"></div>
      <div className="flex bg-grabit-50 px-5 pb-6 ">
        <Button onClick={onclick} className="w-full p-4" disabled={disabled}>
          {text}
        </Button>
      </div>
    </div>
  );
}

export default Cta;
