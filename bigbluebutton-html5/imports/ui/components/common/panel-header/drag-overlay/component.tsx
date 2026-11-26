import React from 'react';
import { createPortal } from 'react-dom';
import Styled from './styles';
import { PanelDrag } from '../usePanelDrag';

// Shows where the dragged panel goes. It covers the window, so that nothing under
// the pointer reacts to the drag, and nothing is resized until the drop.
const DragOverlay: React.FC<{ drag: PanelDrag }> = ({ drag }) => createPortal(
  <Styled.Overlay data-test="panelDropOverlay">
    {drag.area && (
      <Styled.Area
        $isActive={drag.isActive}
        style={drag.area}
        data-test={`panelDrop-${drag.kind}`}
        data-active={drag.isActive}
      >
        {drag.label && <Styled.Label $isActive={drag.isActive}>{drag.label}</Styled.Label>}
      </Styled.Area>
    )}
    {drag.ghost && (
      <Styled.Ghost style={{ left: drag.x + 12, top: drag.y + 12 }}>{drag.ghost}</Styled.Ghost>
    )}
  </Styled.Overlay>,
  document.body,
);

export default DragOverlay;
