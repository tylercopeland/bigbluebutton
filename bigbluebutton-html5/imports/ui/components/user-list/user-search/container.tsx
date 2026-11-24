import React from 'react';
import UserSearch from './component';
import isUserListSearchEnabled from './service';

interface UserSearchContainerProps {
  onSearchChange: (query: string) => void;
  isQueryLoading: boolean;
  onClose: () => void;
}

const UserSearchContainer: React.FC<UserSearchContainerProps> = ({
  onSearchChange, isQueryLoading, onClose,
}) => {
  if (!isUserListSearchEnabled()) return null;

  return (
    <UserSearch
      onSearchChange={onSearchChange}
      isQueryLoading={isQueryLoading}
      onClose={onClose}
    />
  );
};

export default UserSearchContainer;
