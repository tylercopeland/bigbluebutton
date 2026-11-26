import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import BBBMenu from '/imports/ui/components/common/menu/component';
import usePanelSections from '/imports/ui/components/sidebar-content/sections/usePanelSections';
import useToolName from '/imports/ui/components/sidebar-content/sections/useToolName';
import usePanelSide from '/imports/ui/components/sidebar-content/usePanelSide';
import useMovePanelSide from '../useMovePanelSide';
import Styled from '../section-title/styles';

const intlMessages = defineMessages({
  label: {
    id: 'app.sidebarContent.arrange.label',
    description: 'Accessible label for the button that arranges a panel section',
    defaultMessage: 'Arrange {name}',
  },
  moveBelow: {
    id: 'app.sidebarContent.arrange.moveBelow',
    description: 'Menu item that stacks a tool below the others',
    defaultMessage: 'Move {name} below',
  },
  combine: {
    id: 'app.sidebarContent.arrange.combine',
    description: 'Menu item that adds a tool as a tab next to another',
    defaultMessage: 'Combine with {other}',
  },
  moveAside: {
    id: 'app.sidebarContent.arrange.moveAside',
    description: 'Menu item that opens a tool in a panel of its own, across the stage',
    defaultMessage: '{side, select, right {Open {name} on the right} other {Open {name} on the left}}',
  },
  moveBack: {
    id: 'app.sidebarContent.arrange.moveBack',
    description: 'Menu item that brings a docked tool back to the side panel',
    defaultMessage: 'Move {name} back to the side panel',
  },
  moveRight: {
    id: 'app.sidebarContent.arrange.moveRight',
    description: 'Menu item that moves the panel to the right',
    defaultMessage: 'Move panel to right',
  },
  moveLeft: {
    id: 'app.sidebarContent.arrange.moveLeft',
    description: 'Menu item that moves the panel to the left',
    defaultMessage: 'Move panel to left',
  },
});

const GRIP_DOTS = [6, 12, 18].flatMap((y) => [9, 15].map((x) => ({ x, y })));

interface ArrangeMenuProps {
  /** The tool the menu acts on: the section's selected tab, or a tab opened from the keyboard */
  tool: string;
  /** Opens the menu without a click, for a tab's Shift F10 or right click */
  isForcedOpen: boolean;
  onClose: () => void;
}

/**
 * The keyboard and screen reader way to do what dragging does. Its button is
 * also the grip that drags the panel to the other side.
 */
const ArrangeMenu: React.FC<ArrangeMenuProps> = ({ tool, isForcedOpen, onClose }) => {
  const intl = useIntl();
  const toolName = useToolName();
  const sections = usePanelSections();
  const { canMove, isPanelOnRight } = usePanelSide();
  const movePanelSide = useMovePanelSide();
  const name = toolName(tool);

  const actions = [];
  if (sections.canMoveBelow(tool)) {
    actions.push({
      key: 'moveBelow',
      dataTest: 'arrangeMoveBelow',
      label: intl.formatMessage(intlMessages.moveBelow, { name }),
      onClick: () => sections.moveBelow(tool),
    });
  }
  const target = sections.sections[sections.getCombineTarget(tool)];
  if (target) {
    actions.push({
      key: 'combine',
      dataTest: 'arrangeCombine',
      label: intl.formatMessage(intlMessages.combine, { other: toolName(target.active) }),
      onClick: () => sections.combine(tool),
    });
  }
  if (sections.canMoveAside(tool)) {
    actions.push({
      key: 'moveAside',
      dataTest: 'arrangeMoveAside',
      label: intl.formatMessage(intlMessages.moveAside, {
        name, side: sections.isAsideOnRight ? 'right' : 'left',
      }),
      onClick: () => sections.moveAside(tool),
    });
  }
  const isAside = sections.isAside(tool);
  if (isAside) {
    actions.push({
      key: 'moveBack',
      dataTest: 'arrangeMoveBack',
      label: intl.formatMessage(intlMessages.moveBack, { name }),
      onClick: sections.moveBack,
    });
  }
  // The docked panel always sits across from the side panel, so only the side panel moves
  if (canMove && !isAside) {
    actions.push({
      key: 'moveSide',
      dataTest: 'arrangeMoveSide',
      label: intl.formatMessage(isPanelOnRight ? intlMessages.moveLeft : intlMessages.moveRight),
      onClick: movePanelSide,
    });
  }

  return (
    <BBBMenu
      trigger={(
        <Styled.Grip
          type="button"
          data-column-grip
          data-test="arrangeMenuButton"
          aria-label={intl.formatMessage(intlMessages.label, { name })}
          aria-haspopup="menu"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {GRIP_DOTS.map(({ x, y }) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.7" />)}
          </svg>
        </Styled.Grip>
      )}
      actions={actions}
      open={isForcedOpen ? true : undefined}
      onCloseCallback={onClose}
      dataTest="arrangeMenu"
      opts={{
        id: 'arrange-panel-menu',
        autoFocus: isForcedOpen,
        keepMounted: false,
        transitionDuration: 0,
        elevation: 3,
        getcontentanchorel: null,
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        transformOrigin: { vertical: 'top', horizontal: 'left' },
      }}
    />
  );
};

export default ArrangeMenu;
