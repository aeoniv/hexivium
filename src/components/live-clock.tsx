
'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export function LiveClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const displayTime = time ? format(time, 'EEE, MMM d, yyyy HH:mm:ss') : '...';

  return (
    <div className="text-sm font-mono text-muted-foreground text-center">
      <span>{displayTime}</span>
    </div>
  );
}
