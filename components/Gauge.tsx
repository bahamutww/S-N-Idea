import React from 'react';

interface GaugeProps {
  score: number;
  label?: string;
}

export const Gauge: React.FC<GaugeProps> = ({ score, label }) => {
  // SVG calculation
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = "text-yellow-500";
  if (score >= 80) colorClass = "text-green-500";
  if (score < 40) colorClass = "text-red-500";

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative w-40 h-40">
        <svg
          height="100%"
          width="100%"
          className="transform -rotate-90"
        >
          <circle
            stroke="#e2e8f0"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx="50%"
            cy="50%"
          />
          <circle
            className={`transition-all duration-1000 ease-out ${colorClass}`}
            stroke="currentColor"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx="50%"
            cy="50%"
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${colorClass}`}>
            {Math.round(score)}
          </span>
          {label && <span className="text-xs text-slate-500 uppercase tracking-wide mt-1">{label}</span>}
        </div>
      </div>
    </div>
  );
};
