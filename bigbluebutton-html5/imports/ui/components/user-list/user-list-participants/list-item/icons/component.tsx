import React from 'react';

interface IconProps {
  size?: number;
}

const makeIcon = (path: string, defaultSize: number): React.FC<IconProps> => {
  const OutlineIcon: React.FC<IconProps> = ({ size = defaultSize }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
  return OutlineIcon;
};

export const MicIcon = makeIcon('M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z M5 11a7 7 0 0 0 14 0 M12 18v3', 16);
export const MicOffIcon = makeIcon('M3 3l18 18 M9 9v3a3 3 0 0 0 5.1 2.1 M15 9.3V6a3 3 0 0 0-5.7-1.3 M19 11a7 7 0 0 1-1.2 3.9 M5 11a7 7 0 0 0 10.6 6 M12 18v3', 16);
export const HeadphonesIcon = makeIcon('M4 15v-3a8 8 0 0 1 16 0v3 M4 15h3v5H4z M17 15h3v5h-3z', 16);
export const HeadphonesOffIcon = makeIcon('M3 3l18 18 M4 15v-3a8 8 0 0 1 12.5-6.6 M20 12v3 M4 15h3v5H4z M17 15h3v5h-3z', 16);
export const CameraIcon = makeIcon('M3 7h12v10H3z M15 10l6-3v10l-6-3', 16);
export const BarsIcon = makeIcon('M7 10v4 M12 6v12 M17 10v4', 16);
export const HandIcon = makeIcon('M8 13V5.5a1.5 1.5 0 0 1 3 0V12 M11 11V4a1.5 1.5 0 0 1 3 0v7 M14 11V5.5a1.5 1.5 0 0 1 3 0V14 M8 13V9.5a1.5 1.5 0 0 0-3 0V15a6 6 0 0 0 6 6h1a6 6 0 0 0 6-6v-1', 12);
export const PresenterIcon = makeIcon('M3 4h18 M5 4v10h14V4 M12 14v3 M8 21l4-4 4 4', 12);
export const MessageIcon = makeIcon('M4 5h16v11H9l-5 4z', 14);

export const MoreIcon: React.FC<IconProps> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="5" r="1.9" />
    <circle cx="12" cy="12" r="1.9" />
    <circle cx="12" cy="19" r="1.9" />
  </svg>
);
