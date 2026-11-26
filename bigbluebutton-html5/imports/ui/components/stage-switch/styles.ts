import styled from 'styled-components';
import { roomFocusRing } from '/imports/ui/stylesheets/styled-components/palette';

// "What you're presenting": slides or the shared screen, above the stage
const TabList = styled.div`
  position: absolute;
  z-index: 3;
  display: flex;
  gap: 4px;
  padding: 3px;
  box-sizing: border-box;
  border-radius: 11px;
  background: #131D2C;
  border: 1px solid #24344A;
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  padding: 0 12px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #E6EDF5;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, .06);
  }

  &[aria-selected="true"] {
    background: #E6EEF9;
    color: #0F1B2B;
  }

  &:focus-visible {
    outline: 2px solid ${roomFocusRing};
    outline-offset: 1px;
  }

  svg {
    flex-shrink: 0;
  }
`;

const Count = styled.span`
  font-weight: 500;
  opacity: .75;
  font-variant-numeric: tabular-nums;
`;

const LiveDot = styled.span`
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 4px;
  background: #FF5A5F;
`;

// On the shared screen, so the presenter knows everyone sees it
const LivePill = styled.div`
  position: absolute;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 40px;
  box-sizing: border-box;
  padding: 0 5px 0 14px;
  border-radius: 20px;
  background: rgba(11, 18, 32, .86);
  border: 1px solid rgba(255, 255, 255, .12);
  box-shadow: 0 8px 24px rgba(0, 0, 0, .35);
  backdrop-filter: blur(8px);
  color: #E6EDF5;
  font-size: 13px;
  white-space: nowrap;
  transform: translateX(-50%);

  ${LiveDot} {
    box-shadow: 0 0 0 3px rgba(255, 90, 95, .25);
  }
`;

const StopButton = styled.button`
  height: 30px;
  padding: 0 14px;
  border: 0;
  border-radius: 15px;
  background: #E5484D;
  color: #FFF;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #D13C41;
  }

  &:focus-visible {
    outline: 2px solid ${roomFocusRing};
    outline-offset: 2px;
  }
`;

// Read by screen readers only
const Announcer = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

export default {
  TabList, Tab, Count, LiveDot, LivePill, StopButton, Announcer,
};
