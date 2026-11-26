import React from 'react';
import PropTypes from 'prop-types';

const DEFAULT_SIZE = 18;

const OutlineIcon = ({ d, size = DEFAULT_SIZE }) => (
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
    <path d={d} />
  </svg>
);

OutlineIcon.propTypes = {
  d: PropTypes.string.isRequired,
  // eslint-disable-next-line react/require-default-props
  size: PropTypes.number,
};

export const PreviousIcon = () => <OutlineIcon d="M15 6l-6 6 6 6" />;
export const NextIcon = () => <OutlineIcon d="M9 6l6 6-6 6" />;
export const CloseIcon = () => <OutlineIcon d="M6 6l12 12 M18 6L6 18" size={16} />;
export const MoreIcon = () => <OutlineIcon d="M5 12h.01 M12 12h.01 M19 12h.01" />;
export const UndoIcon = () => <OutlineIcon d="M9 14L4 9l5-5 M4 9h10a6 6 0 0 1 0 12h-3" />;
export const RedoIcon = () => <OutlineIcon d="M15 14l5-5-5-5 M20 9H10a6 6 0 0 0 0 12h3" />;
export const MinimizeIcon = () => <OutlineIcon d="M4 14h6v6 M20 10h-6V4 M14 10l7-7 M3 21l7-7" />;
