import React from 'react';

interface IconProps {
  d: string;
}

const OutlineIcon: React.FC<IconProps> = ({ d }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

export const SlidesIcon = () => <OutlineIcon d="M3 4h18 M5 4v10h14V4 M12 14v3 M8 21l4-4 4 4 M9 11V9 M12 11V7 M15 11v-1" />;
export const VideoIcon = () => <OutlineIcon d="M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18 M10 8.5l5 3.5-5 3.5z" />;
export const ScreenIcon = () => <OutlineIcon d="M3 5h18v14H3z M3 9h18 M6 7h.01 M8.5 7h.01" />;
export const CameraIcon = () => <OutlineIcon d="M2.5 7.5a1.5 1.5 0 0 1 1.5-1.5h10a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H4a1.5 1.5 0 0 1-1.5-1.5z M15.5 10.5l6-3.5v10l-6-3.5" />;
export const MoreIcon = () => <OutlineIcon d="M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M17 14v6 M14 17h6" />;
export const AddIcon = () => <OutlineIcon d="M12 5v14 M5 12h14" />;
export const CheckIcon = () => <OutlineIcon d="M5 12.5l4.5 4.5L19 7.5" />;
