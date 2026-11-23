import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import Styled from './styles';
import { layoutDispatch } from '/imports/ui/components/layout/context';
import { PANELS, ACTIONS } from '/imports/ui/components/layout/enums';

interface OverflowTileProps {
  overflowCount: number;
}

const intlMessages = defineMessages({
  more: {
    id: 'app.video.overflowMore',
    description: 'Number of people who do not fit next to the presentation',
    defaultMessage: '+{count} more',
  },
  showPeople: {
    id: 'app.video.overflowShowPeople',
    description: 'Accessible label for the tile that opens the people list',
    defaultMessage: '+{count} more, show people',
  },
});

const OverflowTile: React.FC<OverflowTileProps> = ({ overflowCount }) => {
  const intl = useIntl();
  const layoutContextDispatch = layoutDispatch();

  if (overflowCount <= 0) return null;

  const handleOpenUserList = () => {
    layoutContextDispatch({
      type: ACTIONS.SET_SIDEBAR_NAVIGATION_IS_OPEN,
      value: true,
    });
    layoutContextDispatch({
      type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
      value: true,
    });
    layoutContextDispatch({
      type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
      value: PANELS.USERLIST,
    });
  };

  return (
    <Styled.OverflowTile
      type="button"
      aria-label={intl.formatMessage(intlMessages.showPeople, { count: overflowCount })}
      onClick={handleOpenUserList}
    >
      <bdi>{intl.formatMessage(intlMessages.more, { count: overflowCount })}</bdi>
    </Styled.OverflowTile>
  );
};

export default OverflowTile;
