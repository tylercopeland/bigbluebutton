import React from 'react';

const ROW_SELECTOR = '[role="listitem"]';

// Up and down move between rows, left and right move between a row's buttons.
// The row buttons are kept out of the tab order so that long lists stay one stop.
const handleRowNavigation = (event: React.KeyboardEvent<HTMLElement>) => {
  const list = event.currentTarget;
  const target = event.target as HTMLElement;
  // React bubbles events from the row menus, which are rendered outside the list
  if (!list.contains(target)) return;

  const rows = Array.from(list.querySelectorAll<HTMLElement>(ROW_SELECTOR));
  const row = target.closest<HTMLElement>(ROW_SELECTOR);
  const rowIndex = row ? rows.indexOf(row) : -1;

  let next: HTMLElement | undefined;
  switch (event.key) {
    case 'ArrowDown':
      next = rows[rowIndex + 1];
      break;
    case 'ArrowUp':
      next = rows[rowIndex - 1];
      break;
    case 'Home':
      [next] = rows;
      break;
    case 'End':
      next = rows[rows.length - 1];
      break;
    case 'ArrowLeft':
    case 'ArrowRight': {
      if (!row) return;
      const stops = [row, ...Array.from(row.querySelectorAll<HTMLElement>('button'))];
      const isForward = (event.key === 'ArrowRight') !== (getComputedStyle(row).direction === 'rtl');
      next = stops[stops.indexOf(target) + (isForward ? 1 : -1)];
      break;
    }
    default:
      return;
  }

  event.preventDefault();
  event.stopPropagation();
  next?.focus();
};

export default handleRowNavigation;
