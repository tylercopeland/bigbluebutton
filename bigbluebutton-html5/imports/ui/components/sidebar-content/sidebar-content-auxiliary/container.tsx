import React from 'react';
import SidebarContentAuxiliary from './component';
import { layoutSelectInput, layoutSelectOutput, layoutDispatch } from '/imports/ui/components/layout/context';
import { Input, Output } from '/imports/ui/components/layout/layoutTypes';
import useIsNavigationDocked from '/imports/ui/components/sidebar-navigation/hooks/useIsNavigationDocked';

const SidebarContentAuxiliaryContainer = () => {
  const sidebarContentAuxiliaryInput = layoutSelectInput((i: Input) => i.sidebarContentAuxiliary);
  const sidebarContentAuxiliaryOutput = layoutSelectOutput((i: Output) => i.sidebarContentAuxiliary);
  const layoutContextDispatch = layoutDispatch();
  const isDocked = useIsNavigationDocked();
  const { sidebarContentPanel } = sidebarContentAuxiliaryInput;
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
  } = sidebarContentAuxiliaryOutput;

  // While docked, the panel across the stage holds a docked tool instead (sections/aside)
  if (isDocked) return null;
  if (!sidebarContentAuxiliaryInput.isOpen || sidebarContentAuxiliaryOutput.display === false) return null;

  return (
    <SidebarContentAuxiliary
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
      isSharedNotesPinned={false}
    />
  );
};

export default SidebarContentAuxiliaryContainer;
