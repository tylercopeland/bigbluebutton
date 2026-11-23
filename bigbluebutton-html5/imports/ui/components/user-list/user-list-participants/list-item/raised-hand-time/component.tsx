import React, { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import useTimeSync from '/imports/ui/core/local-states/useTimeSync';

const intlMessages = defineMessages({
  raised: {
    id: 'app.userList.raisedHand.raised',
    description: 'Status of a user with a raised hand, when the time is unknown',
    defaultMessage: 'Raised',
  },
  justNow: {
    id: 'app.userList.raisedHand.justNow',
    description: 'Status of a user who raised their hand less than a minute ago',
    defaultMessage: 'Raised · just now',
  },
  minutes: {
    id: 'app.userList.raisedHand.minutes',
    description: 'Status of a user who raised their hand minutes ago',
    defaultMessage: 'Raised · {minutes} min',
  },
  hours: {
    id: 'app.userList.raisedHand.hours',
    description: 'Status of a user who raised their hand hours ago',
    defaultMessage: 'Raised · {hours} hr',
  },
});

const REFRESH_INTERVAL = 10000;
const MINUTE = 60000;

const RaisedHandTime: React.FC<{ raiseHandTime?: string }> = ({ raiseHandTime }) => {
  const intl = useIntl();
  const [timeSync] = useTimeSync();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [raiseHandTime]);

  const raisedAt = raiseHandTime ? new Date(raiseHandTime).getTime() : NaN;
  if (Number.isNaN(raisedAt)) return <span>{intl.formatMessage(intlMessages.raised)}</span>;

  const minutes = Math.floor((now + timeSync - raisedAt) / MINUTE);
  if (minutes < 1) return <span>{intl.formatMessage(intlMessages.justNow)}</span>;
  if (minutes < 60) return <span>{intl.formatMessage(intlMessages.minutes, { minutes })}</span>;
  return <span>{intl.formatMessage(intlMessages.hours, { hours: Math.floor(minutes / 60) })}</span>;
};

export default RaisedHandTime;
