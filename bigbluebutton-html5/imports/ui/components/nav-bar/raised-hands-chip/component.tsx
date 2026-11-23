import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { layoutDispatch } from '/imports/ui/components/layout/context';
import { ACTIONS, PANELS } from '/imports/ui/components/layout/enums';
import Tooltip from '/imports/ui/components/common/tooltip/component';
import useCurrentUser from '/imports/ui/core/hooks/useCurrentUser';
import useDeduplicatedSubscription from '/imports/ui/core/hooks/useDeduplicatedSubscription';
import useMeeting from '/imports/ui/core/hooks/useMeeting';
import { RAISED_HAND_USERS, RaisedHandUsersSubscriptionResponse } from '/imports/ui/core/graphql/queries/users';
import { setUserListFilter } from '/imports/ui/core/local-states/useUserListFilter';
import { filterByMeetingId } from '/imports/ui/core/utils/subscriptionFilters';
import { HandIcon } from '/imports/ui/components/user-list/user-list-participants/list-item/icons/component';
import Styled from './styles';

const intlMessages = defineMessages({
  raised: {
    id: 'app.navBar.raisedHands.label',
    description: 'Number of raised hands',
    defaultMessage: '{count} raised',
  },
  show: {
    id: 'app.navBar.raisedHands.show',
    description: 'Accessible label for the button that shows who raised their hand',
    defaultMessage: '{count, plural, one {# raised hand} other {# raised hands}}, show in people',
  },
});

const RaisedHandsChip: React.FC = () => {
  const intl = useIntl();
  const layoutContextDispatch = layoutDispatch();
  const { data: currentUser } = useCurrentUser((user) => ({ locked: user.locked }));
  const { data: meeting } = useMeeting((m) => ({
    meetingId: m.meetingId,
    lockSettings: m.lockSettings,
  }));
  const { data } = useDeduplicatedSubscription<RaisedHandUsersSubscriptionResponse>(RAISED_HAND_USERS);

  const isUserListHidden = currentUser?.locked && meeting?.lockSettings?.hideUserList;
  if (!meeting?.meetingId || isUserListHidden) return null;

  const count = filterByMeetingId(
    data?.user,
    meeting.meetingId,
    RAISED_HAND_USERS,
    (u) => ({ mismatchedUserId: u.userId }),
  ).length;
  if (count === 0) return null;

  const showRaisedHands = () => {
    setUserListFilter('raisedHands');
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

  const label = intl.formatMessage(intlMessages.show, { count });

  return (
    <Tooltip title={label}>
      <Styled.Chip
        type="button"
        aria-label={label}
        onClick={showRaisedHands}
        data-test="raisedHandsChip"
      >
        <Styled.Badge>
          <HandIcon />
        </Styled.Badge>
        <Styled.Label>{intl.formatMessage(intlMessages.raised, { count })}</Styled.Label>
        <Styled.Count>{count}</Styled.Count>
      </Styled.Chip>
    </Tooltip>
  );
};

export default RaisedHandsChip;
