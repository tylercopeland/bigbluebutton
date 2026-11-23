import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import Styled from './styles';

export type UserListFilter = 'all' | 'raisedHands';

const intlMessages = defineMessages({
  label: {
    id: 'app.userList.filters.label',
    description: 'Accessible label for the people filters',
    defaultMessage: 'Filter people',
  },
  all: {
    id: 'app.userList.filters.all',
    description: 'Filter that shows everyone',
    defaultMessage: 'All',
  },
  raisedHands: {
    id: 'app.userList.filters.raisedHands',
    description: 'Filter that shows people with a raised hand',
    defaultMessage: 'Raised hands',
  },
});

interface UserListFiltersProps {
  selected: UserListFilter;
  onSelect: (filter: UserListFilter) => void;
  // null when the user is not allowed to see how many people are in the meeting
  userCount: number | null;
  raisedHandsCount: number;
}

const UserListFilters: React.FC<UserListFiltersProps> = ({
  selected, onSelect, userCount, raisedHandsCount,
}) => {
  const intl = useIntl();

  return (
    <Styled.Filters role="group" aria-label={intl.formatMessage(intlMessages.label)}>
      <Styled.Chip
        type="button"
        aria-pressed={selected === 'all'}
        data-test="userListFilterAll"
        onClick={() => onSelect('all')}
      >
        <span>{intl.formatMessage(intlMessages.all)}</span>
        {userCount !== null && <Styled.Count>{userCount}</Styled.Count>}
      </Styled.Chip>
      <Styled.Chip
        type="button"
        aria-pressed={selected === 'raisedHands'}
        data-test="userListFilterRaisedHands"
        onClick={() => onSelect('raisedHands')}
      >
        <span>{intl.formatMessage(intlMessages.raisedHands)}</span>
        {raisedHandsCount > 0 && <Styled.Count $isRaisedHands>{raisedHandsCount}</Styled.Count>}
      </Styled.Chip>
    </Styled.Filters>
  );
};

export default UserListFilters;
