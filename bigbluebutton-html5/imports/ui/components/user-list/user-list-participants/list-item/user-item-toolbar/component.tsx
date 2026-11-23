import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import * as PluginSdk from 'bigbluebutton-html-plugin-sdk';
import { UserListDropdownItemType } from 'bigbluebutton-html-plugin-sdk/dist/cjs/extensible-areas/user-list-dropdown-item/enums';
import UserItemToolbarProps, { ToolbarEntry } from './types';
import Icon from '/imports/ui/components/common/icon/component';
import Tooltip from '/imports/ui/components/common/tooltip/component';
import BBBMenu from '/imports/ui/components/common/menu/component';
import { MessageIcon, MoreIcon } from '../icons/component';
import Styled from './styles';
import makeDropdownPluginItem from './service';

const intlMessages = defineMessages({
  more: {
    id: 'app.userList.more',
    description: 'Text for identifying more options',
  },
});

const renderPinnedToolbarOption = ({
  key, onClick, dataTest, label, icon, disabled,
}: ToolbarEntry) => (
  <Tooltip key={key} title={label}>
    <Styled.ToolbarButton
      type="button"
      tabIndex={-1}
      aria-label={label}
      onClick={onClick}
      data-test={dataTest}
      disabled={disabled}
    >
      {key === 'privateChat' ? <MessageIcon /> : <Icon iconName={icon} />}
    </Styled.ToolbarButton>
  </Tooltip>
);

const UserItemToolbar: React.FC<UserItemToolbarProps> = ({
  subjectUser,
  pinnedToolbarOptions = [],
  otherToolbarOptions = [],
  setOpenUserAction,
  open,
  userListDropdownItems = [],
}) => {
  const intl = useIntl();
  const userDropdownItems = userListDropdownItems.filter(
    (item: PluginSdk.UserListDropdownInterface) => (subjectUser?.userId === item?.userId),
  );
  const renderOtherToolbarOptions = (
    allowedOtherToolbarOptions: ToolbarEntry[],
    userDropdownItems: PluginSdk.UserListDropdownInterface[],
  ) => {
    if (allowedOtherToolbarOptions.length > 0 || userDropdownItems.length > 0) {
      const beforeUserDropdownItems = userDropdownItems.filter((item) => (
        item?.type === UserListDropdownItemType.FIXED_CONTENT_INFORMATION
        || item?.type === UserListDropdownItemType.GENERIC_CONTENT_INFORMATION
        || (item?.type === UserListDropdownItemType.SEPARATOR
          && (item as PluginSdk.UserListDropdownSeparator)?.position
          === PluginSdk.UserListDropdownSeparatorPosition.BEFORE)
      ));

      const afterUserDropdownItems = userDropdownItems.filter((item) => (
        item?.type !== UserListDropdownItemType.FIXED_CONTENT_INFORMATION
          && item?.type !== UserListDropdownItemType.GENERIC_CONTENT_INFORMATION
          && !(item?.type === UserListDropdownItemType.SEPARATOR
            && (item as PluginSdk.UserListDropdownSeparator)?.position
            === PluginSdk.UserListDropdownSeparatorPosition.BEFORE)
      ));
      const actions = [
        ...makeDropdownPluginItem(beforeUserDropdownItems),
        ...allowedOtherToolbarOptions,
        ...makeDropdownPluginItem(afterUserDropdownItems),
      ].filter((action) => action.allowed);
      return (
        <>
          <BBBMenu
            trigger={
              (
                <Tooltip title={intl.formatMessage(intlMessages.more)}>
                  <Styled.ToolbarButton
                    type="button"
                    tabIndex={-1}
                    aria-label={intl.formatMessage(intlMessages.more)}
                    aria-haspopup="menu"
                    aria-expanded={open}
                    onClick={() => setOpenUserAction(subjectUser.userId)}
                    data-test="moreOptionsUserItemButton"
                  >
                    <MoreIcon />
                  </Styled.ToolbarButton>
                </Tooltip>
              )
            }
            actions={actions}
            onCloseCallback={() => {
              setOpenUserAction(null);
            }}
            open={open}
          />
        </>
      );
    }
    return null;
  };

  const onlyAllowedPinnedToolbarOptions = pinnedToolbarOptions.filter((pinnedToolbarOption) => (
    pinnedToolbarOption.allowed));
  const onlyAllowedOtherToolbarOptions = otherToolbarOptions.filter((otherToolbarOption) => (
    otherToolbarOption.allowed));

  if (onlyAllowedPinnedToolbarOptions.length === 0
    && onlyAllowedOtherToolbarOptions.length === 0
    && userDropdownItems.length === 0) return null;

  return (
    <Styled.ToolbarContainer className="bbb-user-list-item__actions" $isOpen={open}>
      {onlyAllowedPinnedToolbarOptions.map(renderPinnedToolbarOption)}
      {renderOtherToolbarOptions(onlyAllowedOtherToolbarOptions, userDropdownItems)}
    </Styled.ToolbarContainer>
  );
};

export default UserItemToolbar;
