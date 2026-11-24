import styled, { css } from 'styled-components';
import { smPaddingX } from '/imports/ui/stylesheets/styled-components/general';
import {
  colorWhite,
  panelLive,
  panelRowHoverBg,
  roomFocusRing,
} from '/imports/ui/stylesheets/styled-components/palette';
import UserAvatar from '/imports/ui/components/user-avatar/component';
import { PluginButtonIcon } from '/imports/ui/components/plugins/plugin-icon/styles';

interface AvatarProps {
  moderator?: boolean;
  presenter?: boolean;
  talking?: boolean;
  color?: string;
  animations?: boolean;
  emoji?: boolean;
  avatar?: string;
  isSkeleton?: boolean;
}

interface UserItemContentsProps {
  $isActionsOpen?: boolean;
}

const UserItemContents = styled.div<UserItemContentsProps>`
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: var(--panel-row-height, 46px);
  box-sizing: border-box;
  padding: 2px var(--panel-inset, 8px);
  border-radius: var(--panel-scroll-margin, 10px);

  ${({ $isActionsOpen }) => $isActionsOpen && css`
    background-color: ${panelRowHoverBg};
  `}

  &:hover,
  &:focus-within {
    background-color: ${panelRowHoverBg};
  }

  &:hover .bbb-user-list-item__actions,
  &:focus-within .bbb-user-list-item__actions {
    opacity: 1;
    pointer-events: auto;
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid ${roomFocusRing};
    outline-offset: -2px;
  }
`;

// ===== avatar =====

const Avatar = styled(UserAvatar)<AvatarProps>`
  position: relative;
  flex-shrink: 0;
  margin: 0 var(--panel-scroll-margin, 4px);
  border: 0;
  text-align: center;
  font-size: .75rem;
  font-weight: 700;
  user-select: none;
  width: 32px;
  min-width: 32px;
  height: 32px;
  min-height: 32px;

  /* A steady ring replaces the pulse, which is the avatar's first child. */
  &.bbb-avatar--talking {
    box-shadow: 0 0 0 2px ${colorWhite}, 0 0 0 4px ${panelLive};

    > :first-child {
      display: none;
    }
  }
`;

// ======================== Icon Right Container ========================

const IconRightContainer = styled.div`
  margin: .25rem;
  align-content: center;
`;

const SvgContentUserListIcon = styled(PluginButtonIcon)`
  display: inline-flex;
  align-items: center;
`;

const SvgContentUserListIconMargin = styled(PluginButtonIcon)`
  margin-right: ${smPaddingX};
`;

export default {
  Avatar,
  UserItemContents,
  IconRightContainer,
  SvgContentUserListIcon,
  SvgContentUserListIconMargin,
};
