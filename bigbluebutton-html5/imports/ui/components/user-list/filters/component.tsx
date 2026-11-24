import React, { RefObject } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import Icon from '/imports/ui/components/common/icon/component';
import { UserListFilter } from '/imports/ui/core/local-states/useUserListFilter';
import Styled from './styles';

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
  search: {
    id: 'app.userList.searchUsers',
    description: 'Label for the button that shows the search field',
  },
});

interface UserListFiltersProps {
  selected: UserListFilter;
  onSelect: (filter: UserListFilter) => void;
  // null when the user is not allowed to see how many people are in the meeting
  userCount: number | null;
  raisedHandsCount: number;
  // Leave out when search is disabled
  onToggleSearch?: () => void;
  isSearchOpen: boolean;
  searchButtonRef: RefObject<HTMLButtonElement>;
}

const UserListFilters: React.FC<UserListFiltersProps> = ({
  selected,
  onSelect,
  userCount,
  raisedHandsCount,
  onToggleSearch = undefined,
  isSearchOpen,
  searchButtonRef,
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
      {onToggleSearch && (
        <Styled.SearchButton
          ref={searchButtonRef}
          type="button"
          aria-label={intl.formatMessage(intlMessages.search)}
          title={intl.formatMessage(intlMessages.search)}
          aria-expanded={isSearchOpen}
          data-test="toggleUserSearch"
          onClick={onToggleSearch}
        >
          <Icon iconName="search" />
        </Styled.SearchButton>
      )}
    </Styled.Filters>
  );
};

export default UserListFilters;
