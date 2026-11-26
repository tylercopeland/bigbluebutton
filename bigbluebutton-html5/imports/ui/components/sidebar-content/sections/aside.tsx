import React, { useEffect } from 'react';
import { layoutSelectOutput } from '/imports/ui/components/layout/context';
import { Output } from '/imports/ui/components/layout/layoutTypes';
import { PANELS } from '/imports/ui/components/layout/enums';
import NotesContainer from '/imports/ui/components/notes/component';
import NotesRenderMode from '/imports/ui/components/notes/constants';
import browserInfo from '/imports/utils/browserInfo';
import usePanelSections from './usePanelSections';
import renderTool from './renderTool';
import Styled from './styles';
import SidebarStyled from '../styles';

/**
 * One tool docked across the stage from the side panel. The layout keeps room
 * for it, in the place it gives the auxiliary panel.
 */
const AsidePanel: React.FC<{ isSharedNotesPinned: boolean }> = ({ isSharedNotesPinned }) => {
  const { hasAside, aside, isAsideOnRight } = usePanelSections();
  const output = layoutSelectOutput((i: Output) => i.sidebarContentAuxiliary);
  const isShown = hasAside && !!aside && !!output.display && !!output.width;

  // Toasts show on this side of the stage, so they move clear of the panel
  useEffect(() => {
    const { style } = document.documentElement;
    if (isShown) style.setProperty('--bbb-aside-width', `${output.width}px`);
    else style.removeProperty('--bbb-aside-width');
    return () => { style.removeProperty('--bbb-aside-width'); };
  }, [isShown, output.width]);

  if (!hasAside || !aside || !output.display || !output.width) return null;

  return (
    <Styled.Aside
      $isOnRight={isAsideOnRight}
      className="bbb-aside-panel"
      data-test="asidePanel"
      data-aside-panel={aside}
      style={{
        top: output.top,
        left: output.left ?? undefined,
        width: output.width,
        height: output.height,
        zIndex: output.zIndex,
      }}
    >
      <SidebarStyled.SidebarContentPanel $isDocked isRTL={!isAsideOnRight} isChrome={browserInfo.isChrome}>
        {aside === PANELS.SHARED_NOTES
          ? !isSharedNotesPinned && <NotesContainer renderMode={NotesRenderMode.SIDEBAR} isVisible />
          : renderTool(aside)}
      </SidebarStyled.SidebarContentPanel>
    </Styled.Aside>
  );
};

export default AsidePanel;
