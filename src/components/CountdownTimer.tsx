import { useState, useEffect } from 'react';
import { Sparkles, Calendar } from 'lucide-react';

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isNewYear, setIsNewYear] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const newYear = new Date(currentYear + 1, 0, 1, 0, 0, 0);
      const difference = newYear.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setIsNewYear(false);
      } else {
        setIsNewYear(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isNewYear) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-16 text-center border border-slate-700/50">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mb-8">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-4xl mb-4 text-amber-400">Happy New Year 2026</h2>
        <p className="text-xl text-slate-400">Wishing you success and happiness</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-12 border border-slate-700/50">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mb-6">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <p className="text-slate-500 text-sm uppercase tracking-widest mb-2 letter-spacing-2">Time Remaining Until</p>
        <h2 className="text-3xl text-amber-400">January 1, 2026</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>

      <div className="mt-12 flex items-center justify-center gap-3 text-slate-500 text-sm">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
        </span>
        Live
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-gradient-to-b from-slate-700/30 to-slate-800/30 rounded-xl p-8 border border-slate-600/30 hover:border-amber-500/30 transition-all">
      <div className="text-6xl mb-3 text-amber-400 tracking-tight tabular-nums">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-slate-400 text-sm uppercase tracking-widest">{label}</div>
    </div>
  );
}
