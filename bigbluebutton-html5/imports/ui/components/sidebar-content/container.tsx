import React, { useEffect } from 'react';
import SidebarContent from './component';
import usePanelStack, { setVisibleStackPanels, STACKABLE_PANELS } from './stack/usePanelStack';
import { layoutSelectInput, layoutSelectOutput, layoutDispatch } from '../layout/context';
import { Input, Output } from '/imports/ui/components/layout/layoutTypes';
import { SidebarContentContanerProps } from './types';

const SidebarContentContainer = ({ isSharedNotesPinned }: SidebarContentContanerProps) => {
  const sidebarContentInput = layoutSelectInput((i: Input) => i.sidebarContent);
  const sidebarContentOutput = layoutSelectOutput((i: Output) => i.sidebarContent);
  const layoutContextDispatch = layoutDispatch();
  const { sidebarContentPanel } = sidebarContentInput;
  const {
    top,
    left,
    right,
    zIndex,
    minWidth,
    width,
    maxWidth,
    minHeight,
    height,
    maxHeight,
    isResizable,
    resizableEdge,
  } = sidebarContentOutput;

  const { isDetached, isOpen, visiblePanels } = usePanelStack();

  // A stacked panel that is opened, from anywhere, stays until it is closed
  useEffect(() => {
    if (isDetached && isOpen && sidebarContentPanel
      && STACKABLE_PANELS.includes(sidebarContentPanel)) {
      setVisibleStackPanels(visiblePanels);
    }
  }, [isDetached, isOpen, sidebarContentPanel]);

  if (sidebarContentOutput.display === false) return null;

  return (
    <SidebarContent
      top={top}
      left={left}
      right={right}
      zIndex={zIndex}
      minWidth={minWidth}
      width={width}
      maxWidth={maxWidth}
      minHeight={minHeight}
      height={height}
      maxHeight={maxHeight}
      isResizable={isResizable}
      resizableEdge={resizableEdge}
      contextDispatch={layoutContextDispatch}
      sidebarContentPanel={sidebarContentPanel}
      isSharedNotesPinned={isSharedNotesPinned}
    />
  );
};

export default SidebarContentContainer;
