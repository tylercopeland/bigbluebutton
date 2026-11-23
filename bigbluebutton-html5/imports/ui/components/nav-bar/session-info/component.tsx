import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { defineMessages, useIntl } from 'react-intl';
import useMeeting from '/imports/ui/core/hooks/useMeeting';
import useTimeSync from '/imports/ui/core/local-states/useTimeSync';
import useDeduplicatedSubscription from '/imports/ui/core/hooks/useDeduplicatedSubscription';
import { USER_AGGREGATE_COUNT_SUBSCRIPTION } from '/imports/ui/core/graphql/queries/users';
import { UserAggregateCountSubscriptionResponse } from '/imports/ui/components/user-list/types';
import { roomMutedText } from '/imports/ui/stylesheets/styled-components/palette';

const intlMessages = defineMessages({
  peopleCount: {
    id: 'app.navBar.peopleCount',
    description: 'number of people in the session',
    defaultMessage: '{count, plural, one {# person} other {# people}}',
  },
});

const Info = styled.span`
  color: ${roomMutedText};
  font-size: .9rem;
  line-height: 1;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
`;

const pad = (n: number) => n.toString().padStart(2, '0');

const formatElapsed = (total: number) => {
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
};

const SessionInfo: React.FC = () => {
  const intl = useIntl();
  const [timeSync] = useTimeSync();
  const [now, setNow] = useState(Date.now());
  const { data: meeting } = useMeeting((m) => ({ createdTime: m.createdTime }));
  const { data: usersCountData } = useDeduplicatedSubscription<UserAggregateCountSubscriptionResponse>(
    USER_AGGREGATE_COUNT_SUBSCRIPTION,
  );
  const count = usersCountData?.user_aggregate?.aggregate?.count ?? 0;
  const createdTime = meeting?.createdTime;

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!createdTime || !count) return null;

  const elapsed = Math.max(0, Math.floor((now + timeSync - createdTime) / 1000));

  return (
    <Info className="bbb-navbar__session-info" data-test="sessionInfo">
      <bdi>{intl.formatMessage(intlMessages.peopleCount, { count })}</bdi>
      {' · '}
      <bdi>{formatElapsed(elapsed)}</bdi>
    </Info>
  );
};

export default SessionInfo;
