import React, { useState, useEffect } from 'react';
import { Resizable } from 're-resizable';
import { ACTIONS, DEVICE_TYPE, PANELS } from '../layout/enums';
import NotesContainer from '/imports/ui/components/notes/component';
import useIsNavigationDocked from '/imports/ui/components/sidebar-navigation/hooks/useIsNavigationDocked';
import usePanelSections from './sections/usePanelSections';
import SectionDivider from './sections/divider';
import renderTool from './sections/renderTool';
import SectionsStyled from './sections/styles';
import Styled from './styles';
import browserInfo from '/imports/utils/browserInfo';
import usePanelSide from '/imports/ui/components/sidebar-content/usePanelSide';
import { layoutSelect } from '/imports/ui/components/layout/context';
import { Layout } from '/imports/ui/components/layout/layoutTypes';
import { SidebarContentProps } from './types';
import {
  getMarginToMedia,
  SIDEBAR_CONTENT_VERTICAL_MARGIN_PERCENTAGE_HEIGHT,
} from '/imports/ui/components/layout/defaultValues';
import NotesRenderMode from '/imports/ui/components/notes/constants';

// Sections are kept in place by position, so a section's tool stays mounted
// when the other section changes
const SECTION_KEYS = ['top-section', 'bottom-section'];

const SidebarContent = (props: SidebarContentProps) => {
  const {
    top,
    left = undefined,
    right = undefined,
    zIndex,
    minWidth,
    width,
    maxWidth,
    minHeight,
    height,
    maxHeight,
    isResizable,
    resizableEdge,
    contextDispatch,
    sidebarContentPanel,
    isSharedNotesPinned,
  } = props;

  const [resizableWidth, setResizableWidth] = useState(width);
  const [resizableHeight, setResizableHeight] = useState(height);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);
  const [resizeStartHeight, setResizeStartHeight] = useState(0);
  const isDocked = useIsNavigationDocked();
  const panelSections = usePanelSections();
  const { isPanelOnRight: isRTL } = usePanelSide();
  const deviceType = layoutSelect((i: Layout) => i.deviceType);
  const isMobile = deviceType === DEVICE_TYPE.MOBILE;

  useEffect(() => {
    if (!isResizing) {
      setResizableWidth(width);
      setResizableHeight(height);
    }
  }, [width, height]);

  const setSidebarContentSize = (dWidth: number, dHeight: number) => {
    const newWidth = resizeStartWidth + dWidth;
    const newHeight = resizeStartHeight + dHeight;

    setResizableWidth(newWidth);
    setResizableHeight(newHeight);

    contextDispatch({
      type: ACTIONS.SET_SIDEBAR_CONTENT_SIZE,
      value: {
        width: newWidth,
        height: newHeight,
        browserWidth: window.innerWidth,
        browserHeight: window.innerHeight,
      },
    });
  };

  const { isChrome } = browserInfo;

  // Notes stay mounted while hidden, so their editor isn't reloaded each time
  const renderNotes = (isVisible: boolean) => !isSharedNotesPinned && (
    <NotesContainer key="notes" renderMode={NotesRenderMode.SIDEBAR} isVisible={isVisible} />
  );

  const renderSections = () => {
    const { sections, ratio } = panelSections;
    // Notes that show, in a section or the docked panel, are rendered there
    const isNotesShowing = panelSections.isToolShowing(PANELS.SHARED_NOTES);
    const isStacked = sections.length > 1;
    const items: React.ReactNode[] = [];
    sections.forEach((section, index) => {
      if (index === 1) {
        items.push(
          <SectionDivider
            key="divider"
            ratio={ratio}
            onChange={panelSections.setRatio}
            onReset={panelSections.resetRatio}
          />,
        );
      }
      let share = 1;
      if (isStacked) share = index === 0 ? ratio : 1 - ratio;
      items.push(
        <SectionsStyled.Section
          key={SECTION_KEYS[index]}
          data-panel-section={index}
          data-active-tool={section.active}
          $share={share}
          $isStacked={isStacked}
        >
          <React.Fragment key={section.active}>
            {section.active === PANELS.SHARED_NOTES
              ? renderNotes(true)
              : renderTool(section.active)}
          </React.Fragment>
        </SectionsStyled.Section>,
      );
    });
    if (!isNotesShowing) items.push(renderNotes(false));
    return items;
  };

  const renderSinglePanel = () => (
    <>
      {sidebarContentPanel !== PANELS.SHARED_NOTES && renderTool(sidebarContentPanel)}
      {renderNotes(sidebarContentPanel === PANELS.SHARED_NOTES)}
    </>
  );

  if (sidebarContentPanel === PANELS.NONE) return null;

  const sidebarContentMarginToMedia = getMarginToMedia(isDocked, window.innerWidth);
  const sidebarContentVerticalMargin = isDocked
    ? 0
    : window.innerHeight * SIDEBAR_CONTENT_VERTICAL_MARGIN_PERCENTAGE_HEIGHT;

  const innerPanel = !isMobile ? {
    minWidth: minWidth - sidebarContentMarginToMedia,
    maxWidth: maxWidth - sidebarContentMarginToMedia,
    minHeight: minHeight - (2 * sidebarContentVerticalMargin),
    maxHeight: maxHeight - (2 * sidebarContentVerticalMargin),
    width: width - sidebarContentMarginToMedia,
    height: height - (2 * sidebarContentVerticalMargin),
  } : {
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    width,
    height,
  };

  return (
    <Styled.SidebarContentBackdrop
      // Generic sidekick panels carry their id in the panel name; the class keeps only the type
      className={`bbb-sidebar-content bbb-sidebar-content--${
        sidebarContentPanel.includes(PANELS.GENERIC_CONTENT_SIDEKICK)
          ? PANELS.GENERIC_CONTENT_SIDEKICK
          : sidebarContentPanel
      }`}
      isMobile={isMobile}
      $isDocked={isDocked}
      isRTL={isRTL}
      style={{
        top,
        left,
        right,
        width,
        height,
        maxWidth,
        minHeight,
      }}
    >
      <Resizable
        minWidth={innerPanel.minWidth}
        maxWidth={innerPanel.maxWidth}
        minHeight={innerPanel.minHeight}
        maxHeight={innerPanel.maxHeight}
        size={{
          width: innerPanel.width,
          height: innerPanel.height,
        }}
        enable={{
          top: isResizable && resizableEdge?.top,
          left: isResizable && resizableEdge?.left,
          bottom: isResizable && resizableEdge?.bottom,
          right: isResizable && resizableEdge?.right,
        }}
        className="bbb-sidebar-content__panel"
        handleWrapperClass="resizeSidebarContentWrapper"
        data-test="sidebarContentMain"
        onResizeStart={() => {
          setIsResizing(true);
          document.documentElement.classList.add('bbb-layout-resizing');
          setResizeStartWidth(resizableWidth);
          setResizeStartHeight(resizableHeight);
        }}
        onResize={(...[, , , delta]) => setSidebarContentSize(delta.width, delta.height)}
        onResizeStop={() => {
          setIsResizing(false);
          document.documentElement.classList.remove('bbb-layout-resizing');
          setResizeStartWidth(0);
          setResizeStartHeight(0);
        }}
        style={{
          position: 'absolute',
          display: 'flex',
          zIndex,
        }}
        handleStyles={{
          left: {
            width: '4px',
            height: '100%',
            left: '-2px',
            cursor: 'ew-resize',
          },
          right: {
            width: '12px',
            height: '100%',
            right: '-12px',
            cursor: 'ew-resize',
          },
        }}
      >
        <Styled.SidebarContentPanel $isDocked={isDocked} isRTL={isRTL} isChrome={isChrome}>
          {isDocked && panelSections.isVisible ? renderSections() : renderSinglePanel()}
        </Styled.SidebarContentPanel>
      </Resizable>
    </Styled.SidebarContentBackdrop>
  );
};

export default SidebarContent;
