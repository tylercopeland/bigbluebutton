import React from 'react';
import { stageControlBorder } from '/imports/ui/stylesheets/styled-components/palette';

interface TimerRingProps {
  size: number;
  stroke: number;
  color: string;
  /** Part of the ring to fill, from 0 to 1 */
  progress: number;
}

const TimerRing: React.FC<TimerRingProps> = ({
  size, stroke, color, progress,
}) => {
  const center = size / 2;
  const radius = center - stroke / 2;
  const length = 2 * Math.PI * radius;
  const filled = Math.min(1, Math.max(0, progress));

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, transform: 'rotate(-90deg)' }}
    >
      <circle cx={center} cy={center} r={radius} stroke={stageControlBorder} strokeWidth={stroke} />
      {filled > 0 && (
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={length * (1 - filled)}
        />
      )}
    </svg>
  );
};

export default TimerRing;
