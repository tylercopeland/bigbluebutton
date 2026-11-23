import React, { useMemo, useState, memo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { UserListDropdownInterface } from 'bigbluebutton-html-plugin-sdk';
import { useMutation } from '@apollo/client';
import { RAISED_HAND_USERS } from '/imports/ui/core/graphql/queries/users';
import { filterByMeetingId } from '/imports/ui/core/utils/subscriptionFilters';
import { SET_RAISE_HAND } from '/imports/ui/core/graphql/mutations/userMutations';
import { CURRENT_PRESENTATION_PAGE_SUBSCRIPTION } from '/imports/ui/components/whiteboard/queries';
import useDeduplicatedSubscription from '/imports/ui/core/hooks/useDeduplicatedSubscription';
import useMeeting from '/imports/ui/core/hooks/useMeeting';
import useCurrentUser from '/imports/ui/core/hooks/useCurrentUser';
import { RaisedHandUser, User } from '/imports/ui/Types/user';
import { LockSettings, UsersPolicies } from '/imports/ui/Types/meeting';
import logger from '/imports/startup/client/logger';
import Styled from './styles';
import SectionStyled from '../styles';
import ListItem from '../user-list-participants/list-item/component';
import handleRowNavigation from '../hooks/handleRowNavigation';
import { mapRaisedHandToUser } from '../hooks/useUserOperations';

const intlMessages = defineMessages({
  raisedHandsTitle: {
    id: 'app.statusNotifier.raisedHandsTitleNotifier',
    description: 'Raised hands section title',
  },
  lowerHandsLabel: {
    id: 'app.statusNotifier.lowerHands',
    description: 'Button label to lower all raised hands',
  },
});

interface RaisedHandsContainerProps {
  searchQuery?: string;
  // Shown when there is nothing to list; without it nothing is rendered
  emptyMessage?: string;
}

const EMPTY_LIST: UserListDropdownInterface[] = [];

const RaisedHandsContainer: React.FC<RaisedHandsContainerProps> = ({ searchQuery, emptyMessage }) => {
  const intl = useIntl();
  const [openUserAction, setOpenUserAction] = useState<string | null>(null);
  const [setRaiseHand] = useMutation(SET_RAISE_HAND);

  const { data: usersData, error: usersError } = useDeduplicatedSubscription<{
    user: RaisedHandUser[] }>(RAISED_HAND_USERS);

  const { data: meeting, loading: meetingLoading } = useMeeting((m) => ({
    lockSettings: m.lockSettings,
    usersPolicies: m.usersPolicies,
    isBreakout: m.isBreakout,
    meetingId: m.meetingId,
  }));

  const { data: currentUser } = useCurrentUser((u: Partial<User>) => ({
    userId: u.userId,
    name: u.name,
    presenter: u.presenter,
    isModerator: u.isModerator,
    raiseHand: u.raiseHand,
    locked: u.locked,
    color: u.color,
  }));

  const { data: presentationData } = useDeduplicatedSubscription<{
    pres_page_curr: Array<{ pageId: string }> }>(CURRENT_PRESENTATION_PAGE_SUBSCRIPTION);
  const pageId = presentationData?.pres_page_curr?.[0]?.pageId ?? '';

  if (usersError) {
    logger.error(
      { logCode: 'raisehand_notifier_container_subscription_error', extraInfo: { usersError } },
      'Error on requesting raise hand data',
    );
  }

  const raisedHands: RaisedHandUser[] = filterByMeetingId(
    usersData?.user,
    meeting?.meetingId,
    RAISED_HAND_USERS,
    (u) => ({ mismatchedUserId: u.userId, mismatchedName: u.name }),
  );

  const searchTerms = useMemo(
    () => (searchQuery ? searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean) : []),
    [searchQuery],
  );
  const filteredRaisedHands = useMemo(
    () => (searchTerms.length > 0
      ? raisedHands.filter((u) => {
        const nameLower = u.name.toLowerCase();
        return searchTerms.every((term) => nameLower.includes(term));
      })
      : raisedHands),
    [raisedHands, searchTerms],
  );

  if (!meeting || !currentUser || meetingLoading) return null;

  if (filteredRaisedHands.length === 0) {
    return emptyMessage ? (
      <SectionStyled.EmptyMessage data-test="noRaisedHands">{emptyMessage}</SectionStyled.EmptyMessage>
    ) : null;
  }

  const { isModerator, presenter: isPresenter } = currentUser;
  const canLowerAll = isModerator || isPresenter;

  const lowerUserHands = (userId: string) => {
    setRaiseHand({ variables: { userId, raiseHand: false } });
  };

  const title = intl.formatMessage(intlMessages.raisedHandsTitle);

  return (
    <Styled.RaisedHandsContainer>
      <SectionStyled.SectionHeader>
        <SectionStyled.SectionTitle $isRaisedHands>
          {title}
          <SectionStyled.SectionCount>{filteredRaisedHands.length}</SectionStyled.SectionCount>
        </SectionStyled.SectionTitle>
        {canLowerAll && filteredRaisedHands.length > 1 && (
          <Styled.LowerAllHandsButton
            type="button"
            onClick={() => raisedHands.forEach((u) => lowerUserHands(u.userId))}
            data-test="raiseHandRejection"
          >
            {intl.formatMessage(intlMessages.lowerHandsLabel)}
          </Styled.LowerAllHandsButton>
        )}
      </SectionStyled.SectionHeader>
      <Styled.List role="list" aria-label={title} tabIndex={0} onKeyDown={handleRowNavigation}>
        {filteredRaisedHands.map((user, index) => (
          <ListItem
            key={user.userId}
            section="raisedHands"
            index={index}
            user={mapRaisedHandToUser(user)}
            currentUserIsModerator={currentUser.isModerator ?? false}
            currentUserIsPresenter={currentUser.presenter ?? false}
            currentUserLocked={currentUser.locked ?? false}
            lockSettings={meeting.lockSettings as LockSettings}
            usersPolicies={meeting.usersPolicies as UsersPolicies}
            userListDropdownItems={EMPTY_LIST}
            isBreakout={meeting.isBreakout ?? false}
            pageId={pageId}
            open={user.userId === openUserAction}
            setOpenUserAction={setOpenUserAction}
          />
        ))}
      </Styled.List>
    </Styled.RaisedHandsContainer>
  );
};

export default memo(RaisedHandsContainer);
