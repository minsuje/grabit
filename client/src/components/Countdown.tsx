import React, { useState, useMemo, useEffect } from 'react';
import { differenceInSeconds } from 'date-fns';

interface TimerProps {
  deadline: Date;
}

const Countdown: React.FC<TimerProps> = ({ deadline }) => {
  const ONE_DAY = 60 * 60 * 24;
  const ONE_HOUR = 60 * 60;
  const ONE_MINUTE = 60;
  const [currentTime, setCurrentTime] = useState<number>(new Date().getTime());

  const diffInSeconds = differenceInSeconds(deadline, currentTime);

  const getCountdown = () => {
    if (diffInSeconds <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }
    const days = Math.floor(diffInSeconds / ONE_DAY);
    const hours = Math.floor((diffInSeconds - days * ONE_DAY) / ONE_HOUR);
    const minutes = Math.floor((diffInSeconds - days * ONE_DAY - hours * ONE_HOUR) / ONE_MINUTE);
    const seconds = diffInSeconds - days * ONE_DAY - hours * ONE_HOUR - minutes * ONE_MINUTE;

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const countdown = useMemo(getCountdown, [diffInSeconds]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* <span>{countdown.days}:</span> */}
      <span>{countdown.hours}:</span>
      <span>{countdown.minutes}:</span>
      <span>{countdown.seconds}</span>
    </div>
  );
};

export default Countdown;
