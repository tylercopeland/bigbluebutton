import React from 'react';

interface IconProps {
  size?: number;
}

interface OutlineIconProps {
  size: number;
  strokeWidth: string;
  children: React.ReactNode;
}

const OutlineIcon: React.FC<OutlineIconProps> = ({ size, strokeWidth, children }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const BackIcon: React.FC<IconProps> = ({ size = 18 }) => (
  <OutlineIcon size={size} strokeWidth="2">
    <path d="M15 6l-6 6 6 6" />
  </OutlineIcon>
);

export const LockIcon: React.FC<IconProps> = ({ size = 11 }) => (
  <OutlineIcon size={size} strokeWidth="2.2">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </OutlineIcon>
);

export const SendIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <OutlineIcon size={size} strokeWidth="2">
    <path d="M4 12l16-8-6 16-3-7z" />
  </OutlineIcon>
);
