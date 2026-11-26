import React from 'react';

const GRIP_DOTS = [6, 12, 18].flatMap((y) => [9, 15].map((x) => ({ x, y })));

/** Six dots that mark something as draggable */
const GripIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    {GRIP_DOTS.map(({ x, y }) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.7" />)}
  </svg>
);

export default GripIcon;
