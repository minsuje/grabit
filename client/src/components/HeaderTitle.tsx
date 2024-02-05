import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useNavigate } from 'react-router-dom';
import { LuChevronLeft } from 'react-icons/lu';
import { useEffect, useState } from 'react';

function HeaderTitle() {
  const navigate = useNavigate();
  const { title, backPath } = useSelector((state: RootState) => state.header);

  const [scrollPosition, setScrollPosition] = useState(0);
  const updateScroll = () => {
    setScrollPosition(window.scrollY || document.documentElement.scrollTop);
  };
  useEffect(() => {
    window.addEventListener('scroll', updateScroll);
  });

  return (
    <header
      className={
        scrollPosition > 50
          ? 'fixed left-0 right-0 top-0 z-[999] flex items-center justify-between bg-grabit-50/50 px-4 py-3 backdrop-blur-md'
          : 'fixed left-0 right-0 top-0 z-[999] flex items-center justify-between bg-grabit-50 px-4 py-3'
      }
    >
      <div onClick={() => navigate(backPath)} className="flex p-2">
        <LuChevronLeft size={28} />
      </div>

      {scrollPosition > 50 ? (
        <h1 className="absolute left-0 right-0 z-[-1] w-full text-center text-lg text-stone-800 transition-all">
          {title}
        </h1>
      ) : null}
    </header>
  );
}

export default HeaderTitle;
