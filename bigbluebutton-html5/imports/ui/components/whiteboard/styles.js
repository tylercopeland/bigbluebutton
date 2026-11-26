import styled, { createGlobalStyle } from 'styled-components';
import {
  colorOffWhite,
  colorPrimary,
  colorWhite,
  stageControlActiveBg,
  stageControlBorder,
  stageControlColor,
} from '/imports/ui/stylesheets/styled-components/palette';
import { lgBorderRadius } from '/imports/ui/stylesheets/styled-components/general';

const TldrawV2GlobalStyle = createGlobalStyle`
  ${({ isPresenter, hasWBAccess, viewerCanPan }) => (!isPresenter && hasWBAccess && !viewerCanPan) && `
    [data-testid="tools.hand"] {
      display: none !important;
    }
  `}

  ${({ isMultiUserActive }) => !isMultiUserActive && `
    .tl-nametag {
      display: none;
    }
  `}

  ${({ isToolbarVisible }) => (!isToolbarVisible) && `
    .tlui-toolbar,
    .tlui-style-panel__wrapper {
      visibility: hidden;
    }
    #WhiteboardOptionButton {
      opacity: 0.2;
    }
  `}

  #whiteboard-element {
    position: relative;
    height: 100%;
  }

  #whiteboard-element > * {
    position: relative; 
    height: 100%;
  }

  #whiteboard-element .tl-overlays {
    left: 0px;
    bottom: 0px;
  }

  .tlui-navigation-zone,
  .tlui-help-menu,
  .tlui-debug-panel {
    display: none !important;
  }

  .tl-container:focus-within {
    outline: none !important;
  }

  .tl-container {
    border-radius: ${({ isPresenter }) => (isPresenter ? `${lgBorderRadius} ${lgBorderRadius} 0 0` : `${lgBorderRadius}`)};
  }

  .tlui-style-panel__wrapper {
    right: 0px;
    top: -0.35rem;
    position: relative;
  }

  .tl-overlays__item {
    height: auto !important;
    width: auto !important;
  }

  .tlui-popover__content {
    left: -50px !important;
  }

  ${({ isPresenter, isMultiUserActive, pointerDiameter = 5 }) => {
    const numericDiameter = Number(pointerDiameter);
    const safeDiameter = Number.isFinite(numericDiameter) && numericDiameter > 0
      ? numericDiameter
      : 5;
    const scale = safeDiameter / 100;
    const topOffset = 0;
    const leftOffset = 0;
    return !isPresenter && !isMultiUserActive && `
    .tl-cursor use {
      transform: scale(${scale})!important;
      transform-origin: 0 0 !important;
    }

    .tl-collaborator__cursor {
      position: absolute !important;
      left: ${leftOffset}px !important;
      top: ${topOffset}px !important;
    }
  `;
  }}

  .tlui-toolbar__extras {
    position: fixed !important;
    top: 2px !important;
    
  }

  .tlui-toolbar__extras__controls {
    border-radius: var(--radius-4);
    border: none;
    background-color: ${colorOffWhite};
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.16),
      0px 2px 3px rgba(0, 0, 0, 0.24),
      0px 2px 6px rgba(0, 0, 0, 0.1);
  }

  ${({ isRTL }) => (!isRTL) && `
    .tlui-toolbar__extras {
      right: 0;
      left: 50px !important;
    }
  `}

  ${({ isRTL }) => (isRTL) && `
    .tlui-toolbar__extras {
      right: 50px !important;
      left: 0;
    }

    .tlui-toolbar__extras__controls {
      margin-right: 8px;
      margin-left: 0;
    }
  `}

  ${({ bgSelected }) => (bgSelected) && `
      [data-testid="menu-item.toggle-lock"],
      [data-testid="menu-item.toggle-locked"],
      [data-testid="menu-item.paste"],
      [data-testid="menu-item.copy"] {
        display: none !important;
      }
  `}

  [data-testid="menu-item.bring-to-front"],
  [data-testid="menu-item.bring-forward"],
  [data-testid="menu-item.send-backward"],
  [data-testid="menu-item.send-to-back"],
  [data-testid="menu-item.modify"],
  [data-testid="menu-item.conversions"],
  .tlui-helper-buttons,
  [data-testid="main.page-menu"],
  [data-testid="main.menu"],
  [data-testid="tools.more.laser"],
  [data-tool="asset"],
  [data-testid="page-menu.button"],
  [data-testid="menu-item.zoom-to-100"],
  .tlui-menu-zone {
    display: none !important;
  }

  .tl-collaborator__cursor {
    height: auto !important;
    width: auto !important;
  }

  .tlui-layout__mobile .tlui-button__tool {
    height: 30px !important;
    width: 20px !important;
  }

  .tlui-toolbar__inner {
    flex-direction: column-reverse !important;
  }

  .tlui-toolbar__tools {
    flex-direction: column !important;
  }

  .tlui-toolbar {
    align-items: end !important;
  }

  .tlui-layout__bottom {
    grid-row: auto / auto !important;
    position: absolute !important;
    right: 10px !important;
  }

  .tlui-kbd > span {
    font-family: 'Arial', sans-serif !important;
  }

  [data-side="bottom"][data-align="end"][data-state="open"][role="dialog"] {
    right: 3.5rem !important;
    bottom: 9.5rem !important;
  }

  [id*="shape:poll-result"] {
    background-color: white !important;
  }

  [data-testid="tools.delete-selected-items"] {
    display: flex;
  }

  ${({ presentationHeight }) => {
    const minRange = { height: 345, top: 14 };
    const maxRange = { height: 1200, top: 384 };

    const interpolateTop = (height) => {
      if (height <= minRange.height) return `${minRange.top}px`;
      if (height >= maxRange.height) return `${maxRange.top}px`;

      const slope = (maxRange.top - minRange.top) / (maxRange.height - minRange.height);
      const interpolatedTop = minRange.top + slope * (height - minRange.height);
      return `${interpolatedTop}px`;
    };

    const topValue = interpolateTop(presentationHeight);

    let additionalStyles = '';
    if (presentationHeight <= 405) {
      additionalStyles += `
        .tlui-layout__mobile .tlui-button__tool > .tlui-icon {
          height: 10px !important;
          width: 10px !important;
        }

        .tlui-toolbar__tools {
          flex-direction: row !important;
        }

        .tlui-toolbar__inner {
          flex-direction: row-reverse !important;
        }

        .tlui-layout__bottom {
          grid-row: auto / auto !important;
          position: relative !important;
          top: 2px !important;
          left: 0 !important;
          right: 0 !important;
          max-width: 100% !important;
        }

        .tlui-toolbar,
        .tlui-toolbar__inner,
        .tlui-toolbar__left {
          max-width: 100% !important;
        }

        .tlui-toolbar__tools {
          flex-wrap: wrap !important;
          justify-content: center !important;
        }

        .tlui-toolbar__tools .tlui-button__tool {
          width: 30px !important;
          min-width: 30px !important;
        }

        .tlui-toolbar__tools.tlui-toolbar__tools__mobile {
          min-height: 30px !important;
          height: auto !important;
        }

        [data-side="top"][role="dialog"]:has(.tlui-style-panel) {
          left: 10rem !important;
        }
      `;
    }

    return `.tlui-layout__bottom { top: ${topValue} !important; }${additionalStyles}`;
  }}
  ${({ hiddenGeoShapes }) => hiddenGeoShapes?.length > 0 && hiddenGeoShapes.map((shape) => `
    [data-testid="style.geo.${shape}"] { display: none !important; }
  `).join('')}

  /* Tools in a column down the slide's right side, below its corner buttons */
  .bbb-presentation--overlay {
    .tl-container {
      border-radius: ${lgBorderRadius};
    }

    .tlui-layout .tlui-layout__bottom {
      position: absolute !important;
      top: 64px !important;
      left: auto !important;
      right: auto !important;
      bottom: auto !important;
      inset-inline-end: 12px !important;
      /* Short slides: the column scrolls rather than running off the slide */
      max-height: calc(100% - 76px) !important;
    }

    .tlui-toolbar {
      max-height: 100%;
      padding: 0;
    }

    .tlui-toolbar .tlui-toolbar__inner {
      flex-direction: column !important;
      align-items: center;
      gap: 0;
      width: 42px;
      max-height: 100%;
      overflow-y: auto;
      scrollbar-width: none;
      box-sizing: border-box;
      padding: 4px;
      border: 1px solid ${stageControlBorder};
      border-radius: 12px;
      background-color: ${colorWhite};
      box-shadow: 0 6px 18px rgba(15, 23, 36, .18);
      pointer-events: all;
    }

    .tlui-toolbar .tlui-toolbar__tools {
      flex-direction: column !important;
      gap: 2px;
      width: 32px;
      height: auto;
      min-height: 0;
      background: none;
      box-shadow: none;
    }

    /* Color and styles, under the tools */
    .tlui-toolbar__inner > .tlui-toolbar__tools {
      margin-block-start: 4px;
      padding-block-start: 4px;
      border-block-start: 1px solid ${stageControlBorder};
      border-radius: 0;
    }

    .tlui-toolbar .tlui-toolbar__tools .tlui-button__tool {
      width: 32px !important;
      min-width: 32px;
      height: 32px !important;
      flex-shrink: 0;
      margin: 0;
      color: ${stageControlColor};
    }

    .tlui-toolbar .tlui-button__tool::after {
      inset: 0 !important;
      border-radius: 8px;
    }

    .tlui-toolbar .tlui-button__tool[data-state="selected"] {
      color: ${colorPrimary} !important;
    }

    .tlui-toolbar .tlui-button__tool[data-state="selected"]:not(:disabled)::after {
      background: ${stageControlActiveBg};
    }

    .tlui-toolbar .tlui-button__tool > .tlui-icon {
      position: relative;
      z-index: 1;
      width: 18px !important;
      height: 18px !important;
    }

    /* Select, pen, shapes, text, eraser, then the rest */
    [data-testid="tools.select"] { order: -6; }
    [data-testid="tools.draw"] { order: -5; }
    [data-testid="tools.highlight"],
    [data-testid="tools.rectangle"] { order: -4; }
    [data-testid="tools.text"] { order: -3; }
    [data-testid="tools.eraser"] { order: -2; }

    .tlui-popover__content {
      left: auto !important;
    }

    .tlui-toolbar .tlui-toolbar__extras {
      top: 12px !important;
    }
  }

  [data-darkreader-scheme="dark"] button[data-testid="mobile.styles"] {
    & > div.tlui-icon {
      color: ${colorWhite};
    }
  }

    ${({ cursorType }) => (cursorType) && `
      .tl-canvas {
        cursor: ${cursorType} !important;
      }
  `}

`;

const EditableWBWrapper = styled.div`
  &, & > :first-child {
    cursor: inherit !important;
  }
`;

export default {
  TldrawV2GlobalStyle,
  EditableWBWrapper,
};
