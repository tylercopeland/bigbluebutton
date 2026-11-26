import styled, { css } from 'styled-components';
import QuickPollDropdownContainer from '/imports/ui/components/actions-bar/quick-poll-dropdown/container';
import { smallOnly, hasPhoneDimentions } from '/imports/ui/stylesheets/styled-components/breakpoints';
import {
  colorPrimary,
  colorOffWhite,
  toolbarButtonColor,
  colorWhite,
  colorGrayDark,
  colorBlueLightest,
  toolbarButtonColorDisabled,
  panelRowHoverBg,
  panelText,
  roomFocusRing,
  stageControlActiveBg,
  stageControlBorder,
  stageControlColor,
} from '/imports/ui/stylesheets/styled-components/palette';
import {
  whiteboardToolbarMargin,
  whiteboardToolbarPaddingSm,
  whiteboardToolbarPadding,
  borderSize,
  lgBorderRadius,
  smPaddingY,
  borderSizeLarge,
  smPaddingX,
} from '/imports/ui/stylesheets/styled-components/general';
import Button from '/imports/ui/components/common/button/component';

const COMPACT_ATTRIBUTE = 'data-compact';
const OVERFLOWING_ATTRIBUTE = 'data-overflowing';
const OUT_OF_ROOM_ATTRIBUTE = 'data-out-of-room';

const PresentationToolbarWrapper = styled.div`
  position: relative;
  z-index: 1;
  pointer-events: auto;
  background-color: ${colorOffWhite};
  border-top: 1px solid ${colorBlueLightest};
  border-radius: 0 0 ${lgBorderRadius} ${lgBorderRadius};
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 2px;
  box-sizing: border-box;

  width: var(--slide-width, 100%);
  max-width: 100%;

  &[${OVERFLOWING_ATTRIBUTE}="true"] {
    width: min-content;
  }

  &[${OUT_OF_ROOM_ATTRIBUTE}="true"] {
    overflow-x: clip;
    overflow-y: visible;
  }

  @media ${smallOnly}, ${hasPhoneDimentions} {
    &[${OUT_OF_ROOM_ATTRIBUTE}="true"] {
      overflow-x: auto;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  select {
    &:-moz-focusring {
      outline: none;
    }
    border: 0;
    background-color: ${colorOffWhite};
    color: ${toolbarButtonColor};
    cursor: pointer;
    margin: 0 0 0 0;
    padding: ${whiteboardToolbarPadding};
    padding-left: ${whiteboardToolbarPaddingSm};

    [dir="rtl"] & {
      margin: 0 0 0 ${whiteboardToolbarMargin};
      padding: ${whiteboardToolbarPadding};
      padding-right: ${whiteboardToolbarPaddingSm};
    }

    & > option {
      color: ${toolbarButtonColor};
      background-color: ${colorOffWhite};
    }
  }

  i {
    color: ${toolbarButtonColor};
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const QuickPollButton = styled(QuickPollDropdownContainer)`
  position: relative;
  color: ${toolbarButtonColor};
  background-color: ${colorOffWhite};
  border-radius: 0;
  box-shadow: none !important;
  border: 0;

  &:focus {
    background-color: ${colorOffWhite};
  }
`;

const QuickPollButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const PresentationSlideControls = styled.div`
  justify-content: center;
  padding-left: ${whiteboardToolbarPadding};
  padding-right: ${whiteboardToolbarPadding};
  display: flex;
  flex-direction: row;
  align-items: center;

  & > button {
    padding: ${whiteboardToolbarPadding};
  }
`;

const PrevSlideButton = styled(Button)`
  i {
    font-size: 1rem;

    [dir="rtl"] & {
      -webkit-transform: scale(-1, 1);
      -moz-transform: scale(-1, 1);
      -ms-transform: scale(-1, 1);
      -o-transform: scale(-1, 1);
      transform: scale(-1, 1);
    }
  }
`;

const NextSlideButton = styled(Button)`
  i {
    font-size: 1rem;
    
    [dir="rtl"] & {
      -webkit-transform: scale(-1, 1);
      -moz-transform: scale(-1, 1);
      -ms-transform: scale(-1, 1);
      -o-transform: scale(-1, 1);
      transform: scale(-1, 1);
    }
  }
`;

const SkipSlideSelect = styled.select`
  padding: 0 ${smPaddingY};
  margin: ${borderSize};
  margin-left: ${whiteboardToolbarMargin};

  [dir="rtl"] & {
    margin: ${borderSize};
    margin-right: ${whiteboardToolbarMargin};
  }

  &:-moz-focusring {
    outline: none;
  }

  &:focus,
  &:hover {
    outline: transparent;
    outline-style: dotted;
    outline-width: ${borderSize};
    background-color: #DCE4EC;
    border-radius: 4px;
  }

  &:focus {
    outline-style: solid;
    box-shadow: 0 0 0 1px #cdd6e0 !important;
  }
`;

const PresentationZoomControls = styled.div`
  justify-content: flex-end;
  padding: 0 ${whiteboardToolbarPadding} 0 0;

  [dir="rtl"] & {
    padding: 0 0 0 ${whiteboardToolbarPadding};
  }

  display: flex;
  flex-direction: row;
  align-items: center;

  button {
    padding: ${whiteboardToolbarPadding};
  }

  i {
    font-size: 1.2rem;
  }
`;

const ZoomToolWrapper = styled.span`
  display: flex;
  align-items: center;

  [${COMPACT_ATTRIBUTE}="true"] & {
    display: none;
  }
`;

const FitToWidthButton = styled(Button)`
  border: none !important;

  & > i {
    font-size: 1.2rem;

    [dir="rtl"] & {
      -webkit-transform: scale(-1, 1);
      -moz-transform: scale(-1, 1);
      -ms-transform: scale(-1, 1);
      -o-transform: scale(-1, 1);
      transform: scale(-1, 1);
    }
  }

  margin-left: ${whiteboardToolbarMargin};
  margin-right: ${whiteboardToolbarMargin};

  position: relative;
  color: ${toolbarButtonColor};
  background-color: ${colorOffWhite};
  border-radius: 0;
  box-shadow: none !important;
  border: 0;

  ${({ $fitToWidth }) => $fitToWidth && `
    & > span {
      border: solid ${borderSizeLarge} ${colorGrayDark};
    }
  `}

  &:focus {
    background-color: ${colorOffWhite};
    border: 0;
  }
`;

const MultiUserTool = styled.span`
  background-color: ${colorPrimary};
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  position: relative;
  z-index: 2;
  bottom: 0.8rem;
  color: ${colorWhite};
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 1px ${borderSizeLarge} ${colorGrayDark};
  font-size: ${smPaddingX};
  user-select: none;
  cursor: pointer;

  [dir="ltr"] & {
    right: .8rem;
  }

  [dir="rtl"] & {
    left: .8rem;
  }
`;

const MUTPlaceholder = styled.div`
  width: 1rem;
  height: 1rem;
  position: relative;
  bottom: 0.5rem;

  [dir="ltr"] & {
    right: 1rem;
  }

  [dir="rtl"] & {
    left: 1rem;
  }
`;

const WBAccessButton = styled(Button)`
  border: none !important;

  i {
    font-size: 1.2rem;

    [dir="rtl"] & {
      -webkit-transform: scale(-1, 1);
      -moz-transform: scale(-1, 1);
      -ms-transform: scale(-1, 1);
      -o-transform: scale(-1, 1);
      transform: scale(-1, 1);
    }
  }

  position: relative;
  color: ${({ $active }) => ($active ? colorPrimary : toolbarButtonColor)};
  i {
    color: ${({ $active }) => ($active ? colorPrimary : toolbarButtonColor)};
  }
  background-color: ${colorOffWhite};
  border-radius: 0;
  box-shadow: none !important;
  border: 0;

  &:focus {
    background-color: ${colorOffWhite};
    border: 0;
  }

  &:disabled {
    color: ${toolbarButtonColorDisabled};
  }
`;

const InfiniteWhiteboardButton = styled(Button)`
  border: none !important;

  svg {
    [dir="rtl"] & {
      -webkit-transform: scale(-1, 1);
      -moz-transform: scale(-1, 1);
      -ms-transform: scale(-1, 1);
      -o-transform: scale(-1, 1);
      transform: scale(-1, 1);
    }
  }

  position: relative;
  color: ${toolbarButtonColor};
  background-color: ${colorOffWhite};
  border-radius: 0;
  box-shadow: none !important;
  border: 0;
  margin-left: 2px;
  margin-right: 2px;

  &:focus {
    background-color: ${colorOffWhite};
    border: 0;
  }
`;

// ===== Controls over the slide =====

const pill = css`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border: 1px solid ${stageControlBorder};
  border-radius: 12px;
  background-color: ${colorWhite};
  box-shadow: 0 6px 18px rgba(15, 23, 36, .18);
`;

const StageControls = styled.div`
  position: relative;
  width: var(--slide-width, 100%);
  max-width: 100%;
  pointer-events: none;
`;

const StageStack = styled.div`
  position: absolute;
  bottom: 12px;
  inset-inline: 12px;

  [data-stacked="true"] > & {
    bottom: 66px;
  }

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
`;

const StagePill = styled.div`
  ${pill}

  &:empty {
    display: none;
  }

  [data-test="multiUsersCount"] {
    bottom: .6rem;
  }
`;

// Quick poll, media and plugin items, which only some slides have
const StageExtras = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  > span[aria-hidden] {
    display: none;
  }
`;

const StageMorePanel = styled.div`
  ${pill}

  i {
    color: ${toolbarButtonColor};
  }
`;

const StageDivider = styled.span`
  flex-shrink: 0;
  width: 1px;
  height: 20px;
  margin: 0 2px;
  background-color: ${stageControlBorder};
`;

const StageButton = styled.button`
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background-color: transparent;
  color: ${stageControlColor};
  cursor: pointer;

  &:hover {
    background-color: ${panelRowHoverBg};
  }

  &[aria-expanded="true"] {
    background-color: ${stageControlActiveBg};
    color: ${colorPrimary};
  }

  &:disabled {
    background-color: transparent;
    color: ${toolbarButtonColorDisabled};
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${roomFocusRing};
    outline-offset: 1px;
  }

  ${({ $isDirectional }) => $isDirectional && `
    [dir="rtl"] & svg {
      transform: scaleX(-1);
    }
  `}
`;

const StageDot = styled.span`
  position: absolute;
  top: 6px;
  inset-inline-end: 6px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: ${colorPrimary};
`;

// The select covers the text, so that clicking the position still jumps to a slide
// The slide number, which opens All slides
const StagePosition = styled.button`
  min-width: 56px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border: 0;
  border-radius: 8px;
  background-color: transparent;
  font-family: inherit;
  font-size: .84rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${panelText};
  cursor: pointer;

  &:hover {
    background-color: ${panelRowHoverBg};
  }

  &[aria-expanded="true"] {
    background-color: ${stageControlActiveBg};
    color: ${colorPrimary};
  }

  &:disabled {
    color: ${toolbarButtonColorDisabled};
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${roomFocusRing};
    outline-offset: 1px;
  }
`;

export { COMPACT_ATTRIBUTE, OVERFLOWING_ATTRIBUTE, OUT_OF_ROOM_ATTRIBUTE };

export default {
  PresentationToolbarWrapper,
  ZoomToolWrapper,
  QuickPollButton,
  QuickPollButtonWrapper,
  PresentationSlideControls,
  PrevSlideButton,
  NextSlideButton,
  SkipSlideSelect,
  PresentationZoomControls,
  FitToWidthButton,
  MultiUserTool,
  WBAccessButton,
  MUTPlaceholder,
  InfiniteWhiteboardButton,
  StageControls,
  StageStack,
  StagePill,
  StageExtras,
  StageMorePanel,
  StageDivider,
  StageButton,
  StageDot,
  StagePosition,
};
