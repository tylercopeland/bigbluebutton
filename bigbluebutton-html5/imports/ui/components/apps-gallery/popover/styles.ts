import styled, { css, keyframes } from 'styled-components';
import { PANELS } from '/imports/ui/components/layout/enums';
import {
  appTintBreakoutBg,
  appTintBreakoutColor,
  appTintPollBg,
  appTintTimerBg,
  appTintTimerColor,
  colorPrimary,
  colorWhite,
  panelBorder,
  panelMutedText,
  panelRowActionBg,
  panelRowActionColor,
  panelRowHoverBg,
  panelTabsBg,
  panelText,
  stageControlBorder,
  timerLow,
} from '/imports/ui/stylesheets/styled-components/palette';

const popIn = keyframes`
  from { opacity: 0; translate: 0 10px; scale: .97; }
  to { opacity: 1; translate: 0 0; scale: 1; }
`;

const resetButton = css`
  border: 0;
  background: none;
  font-family: inherit;
  color: inherit;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${colorPrimary};
    outline-offset: -2px;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  z-index: 999;
`;

const Popover = styled.div`
  position: fixed;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 360px;
  max-width: calc(100vw - 16px);
  max-height: calc(100vh - 140px);
  box-sizing: border-box;
  padding: 14px;
  border-radius: 18px;
  background-color: ${colorWhite};
  color: ${panelText};
  box-shadow: 0 20px 50px rgba(0, 0, 0, .5);
  outline: none;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${popIn} .2s cubic-bezier(.2, .8, .2, 1) both;
  }
`;

const Title = styled.h2`
  margin: 0;
  padding: 2px 4px 0;
  font-size: 16px;
  font-weight: 700;
`;

const Search = styled.input`
  height: 36px;
  box-sizing: border-box;
  padding: 0 12px;
  border: 1px solid ${panelBorder};
  border-radius: 10px;
  background-color: ${colorWhite};
  color: ${panelText};
  font: inherit;

  &:focus-visible {
    outline: 2px solid ${colorPrimary};
    outline-offset: -1px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  overflow-y: auto;
`;

const Tiles = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;

const Pin = styled.button<{ $tile: boolean; $pinned: boolean }>`
  ${resetButton}
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: 14px;
  color: ${({ $pinned }) => ($pinned ? colorPrimary : panelMutedText)};

  ${({ $tile }) => $tile && `
    position: absolute;
    inset-block-start: 4px;
    inset-inline-end: 4px;
    width: 24px;
    height: 24px;
  `}

  ${({ $pinned }) => !$pinned && `
    @media (hover: hover) {
      opacity: 0;
    }
  `}

  &:hover {
    background-color: ${panelRowActionBg};
  }

  &:focus-visible {
    opacity: 1;
  }
`;

const showPinOnHover = css`
  &:hover ${Pin},
  &:has(:focus-visible) ${Pin} {
    opacity: 1;
  }
`;

const Tile = styled.div`
  position: relative;
  ${showPinOnHover}
`;

const TileButton = styled.button`
  ${resetButton}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 104px;
  padding: 10px 6px;
  border: 1px solid ${stageControlBorder};
  border-radius: 14px;
  background-color: ${colorWhite};
  box-shadow: 0 1px 3px rgba(15, 23, 36, .08);

  &:hover {
    background-color: ${panelRowHoverBg};
  }
`;

const tint = ({ $appKey }: { $appKey: string }) => {
  switch ($appKey) {
    case PANELS.BREAKOUT:
      return `background-color: ${appTintBreakoutBg}; color: ${appTintBreakoutColor};`;
    case PANELS.POLL:
      return `background-color: ${appTintPollBg}; color: ${colorPrimary};`;
    case PANELS.TIMER:
      return `background-color: ${appTintTimerBg}; color: ${appTintTimerColor};`;
    default:
      return `background-color: ${panelTabsBg}; color: ${panelRowActionColor};`;
  }
};

const iconBox = css<{ $appKey: string }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  ${tint}
`;

const TileIcon = styled.span<{ $appKey: string }>`
  ${iconBox}
  width: 40px;
  height: 40px;
  border-radius: 12px;
  font-size: 20px;
`;

const TileLabel = styled.span`
  max-width: 100%;
  font-size: 13.5px;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
  overflow-wrap: anywhere;
`;

const Heading = styled.h3`
  margin: 0;
  padding: 2px 4px 0;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: ${panelMutedText};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  padding-inline-end: 6px;
  border-radius: 10px;
  ${showPinOnHover}

  &:hover {
    background-color: ${panelRowHoverBg};
  }
`;

const RowButton = styled.button`
  ${resetButton}
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
  padding: 8px;
  border-radius: 10px;
  text-align: start;
`;

const RowIcon = styled.span<{ $appKey: string }>`
  ${iconBox}
  width: 34px;
  height: 34px;
  border-radius: 10px;
  font-size: 18px;
`;

const RowLabel = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 600;
  overflow-wrap: anywhere;
`;

const Badge = styled.span`
  max-width: 100%;
  padding: 1px 8px;
  border-radius: 10px;
  background-color: ${colorPrimary};
  color: ${colorWhite};
  font-size: 11.5px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Dot = styled.span`
  position: absolute;
  inset-block-start: -2px;
  inset-inline-end: -2px;
  width: 10px;
  height: 10px;
  border: 2px solid ${colorWhite};
  border-radius: 50%;
  background-color: ${timerLow};
`;

const Empty = styled.p`
  margin: 0;
  padding: 12px 4px;
  color: ${panelMutedText};
`;

const Anchor = styled.span`
  display: flex;
`;

export default {
  Overlay,
  Popover,
  Title,
  Search,
  Content,
  Tiles,
  Tile,
  TileButton,
  TileIcon,
  TileLabel,
  Pin,
  Heading,
  List,
  Row,
  RowButton,
  RowIcon,
  RowLabel,
  Badge,
  Dot,
  Empty,
  Anchor,
};
