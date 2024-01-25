import { Button } from './ui/button';

function Cta({ text, onclick }: { text: string; onclick: () => void }) {
  return (
    <div className="cta fixed bottom-0 left-0 right-0 flex flex-col">
      <div className="flex h-8 bg-gradient-to-b from-transparent to-white"></div>
      <div className="flex bg-white px-8  pb-8 ">
        <Button onClick={onclick} className="w-full rounded-md p-6">
          {text}
        </Button>
      </div>
    </div>
  );
}

export default Cta;
