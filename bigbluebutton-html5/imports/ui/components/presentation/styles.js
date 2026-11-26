import styled from 'styled-components';
import {
  innerToastWidth,
  toastIconSide,
  smPaddingX,
  smPaddingY,
  lgBorderRadius,
} from '/imports/ui/stylesheets/styled-components/general';
import {
  colorPrimary,
  colorWhite,
  colorGrayLightest,
  colorOffWhite,
  panelRowHoverBg,
  roomFocusRing,
  stageControlBorder,
  stageControlColor,
} from '/imports/ui/stylesheets/styled-components/palette';
import {
  fontSizeLarger,
} from '/imports/ui/stylesheets/styled-components/typography';
import FullscreenButtonContainer from '/imports/ui/components/common/fullscreen-button/container';
import ToastStyled from '/imports/ui/components/common/toast/styles';
import VisuallyHiddenStyles from '/imports/ui/components/common/visually-hidden/styles';

const { VisuallyHidden } = VisuallyHiddenStyles;

const PresentationSvg = styled.svg`
  object-fit: contain;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;

  //always show an arrow by default
  cursor: default;

  //double click on the whiteboard shouldn't change the cursor
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const PresentationFullscreenButton = styled(FullscreenButtonContainer)`
  z-index: 1;
  position: absolute;
  top: 0;
  right: 0;
  left: auto;
  cursor: pointer;

  [dir="rtl"] & {
    right: auto;
    left : 0;
  }
`;

const InnerToastWrapper = styled.div`
  width: ${innerToastWidth};
`;

const ToastIcon = styled.div`
  margin-right: ${smPaddingX};
  [dir="rtl"] & {
    margin-right: 0;
    margin-left: ${smPaddingX};
  }
`;

const IconWrapper = styled.div`
  background-color: ${colorPrimary};
  width: ${toastIconSide};
  height: ${toastIconSide};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  & > i {
    position: relative;
    color: ${colorWhite};
    font-size: ${fontSizeLarger};
  }
`;

const ToastTextContent = styled.div`
  position: relative;
  overflow: hidden;
  margin-top: ${smPaddingY};
  color: black;

  & > div:first-of-type {
    font-weight: bold;
    line-height: 2;
  }
`;

const PresentationName = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
`;

const ToastDownload = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  a {
    color: ${colorPrimary};
    cursor: pointer;
    text-decoration: none;

    &:focus,
    &:hover,
    &:active {
      color: ${colorPrimary};
      box-shadow: 0;
    }
  }
`;

const Button = styled.button`
  background-color: ${colorOffWhite};
  border: none;
  border-radius: 13px;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.16),
    0px 2px 3px rgba(0, 0, 0, 0.24),
    0px 2px 6px rgba(0, 0, 0, 0.1);
  color: #2d2d2d;
  cursor: pointer;
  padding: .3rem .5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  tab-index: 0;

  &:hover {
    background-color: ${colorGrayLightest};
  }
`;

const ExtraTools = styled.div`
  position: absolute;
  top: 2px;
  right: 43px;
  z-index: 399;
  display: flex;
  gap: 5px;
  height: 35px;

  [dir="rtl"] & {
    right: auto;
    left: 43px;
  }

  ${({ isToolbarVisible }) => !isToolbarVisible && `
    display: none;
  `}
`;

const PresentationContainer = styled.div`
  /* Controls over the slide, shown while it is hovered or used with the keyboard */
  &.bbb-presentation--overlay {
    .bbb-stage-control,
    .tlui-layout__bottom,
    .tlui-toolbar__extras,
    #WhiteboardOptionButton {
      opacity: 0 !important;
      transition: opacity .15s ease !important;
    }

    &:hover,
    &:has(:focus-visible),
    &:has(.bbb-stage-control [aria-expanded="true"]),
    &:has(.tlui-layout [data-state="open"]) {
      .bbb-stage-control,
      .tlui-layout__bottom,
      .tlui-toolbar__extras,
      #WhiteboardOptionButton {
        opacity: 1 !important;
      }
    }

    #WhiteboardOptionButton {
      top: 12px;
      right: auto;
      left: auto;
      inset-inline-end: 60px;

      > div {
        width: 40px;
        height: 40px;
      }

      button {
        border: 1px solid ${stageControlBorder};
        border-radius: 10px;
        background-color: ${colorWhite};
        color: ${stageControlColor};
        box-shadow: 0 6px 18px rgba(15, 23, 36, .18);
      }
    }

    /* Undo and redo, in the top corner row beside the options and minimize */
    ${ExtraTools} {
      top: 12px;
      right: auto;
      left: auto;
      bottom: auto;
      inset-inline-end: 108px;
      gap: 0;
      height: 40px;
      box-sizing: border-box;
      padding: 1px;
      border: 1px solid ${stageControlBorder};
      border-radius: 10px;
      background-color: ${colorWhite};
      box-shadow: 0 6px 18px rgba(15, 23, 36, .18);

      ${Button} {
        width: 36px;
        height: 36px;
        padding: 0;
        border-radius: 8px;
        background-color: transparent;
        box-shadow: none;
        color: ${stageControlColor};

        &:hover {
          background-color: ${panelRowHoverBg};
        }
      }
    }
  }

  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Presentation = styled.div`
  order: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  border-radius: ${lgBorderRadius};
`;

const SvgContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const WhiteboardSizeAvailable = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: -1;
`;

const PresentationToolbar = styled.div`
  display: flex;
  justify-content: center;
  overflow-x: visible;
  order: 2;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: ${({ $isOverlay }) => ($isOverlay ? 2 : 0)};
`;

const ToastSeparator = styled(ToastStyled.Separator)``;

const MinimizeButton = styled.button`
  position: absolute;
  top: 12px;
  inset-inline-end: 12px;
  z-index: 399;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid ${stageControlBorder};
  border-radius: 10px;
  background-color: ${colorWhite};
  color: ${stageControlColor};
  box-shadow: 0 6px 18px rgba(15, 23, 36, .18);
  cursor: pointer;

  &:hover {
    background-color: ${panelRowHoverBg};
  }

  &:focus-visible {
    outline: 2px solid ${roomFocusRing};
  }
`;

const IconWithMask = styled.div.attrs({
  className: 'tlui-icon',
})`
  mask: url(${({ mask }) => mask})  center 100% / 100% no-repeat;
`;

export default {
  VisuallyHidden,
  PresentationSvg,
  PresentationFullscreenButton,
  InnerToastWrapper,
  ToastIcon,
  IconWrapper,
  ToastTextContent,
  PresentationName,
  ToastDownload,
  PresentationContainer,
  Presentation,
  SvgContainer,
  WhiteboardSizeAvailable,
  PresentationToolbar,
  ToastSeparator,
  Button,
  ExtraTools,
  MinimizeButton,
  IconWithMask,
};
