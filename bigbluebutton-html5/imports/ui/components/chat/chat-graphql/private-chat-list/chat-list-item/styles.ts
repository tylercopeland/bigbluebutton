import styled from 'styled-components';
import UserAvatar from '/imports/ui/components/user-avatar/component';
import {
  colorDanger,
  panelMutedText,
  panelRowHoverBg,
  panelText,
  roomFocusRing,
} from '/imports/ui/stylesheets/styled-components/palette';

const ChatListItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  border: 0;
  border-radius: 10px;
  background-color: transparent;
  font-family: inherit;
  text-align: start;
  cursor: pointer;

  &:hover {
    background-color: ${panelRowHoverBg};
  }

  &:focus-visible {
    outline: 2px solid ${roomFocusRing};
    outline-offset: -2px;
  }
`;

const Avatar = styled(UserAvatar)`
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border: 0;
  font-size: .75rem;
  font-weight: 700;
`;

const Text = styled.span`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
`;

const Name = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: .9375rem;
  font-weight: 700;
  line-height: 1.3;
  color: ${panelText};
`;

const Offline = styled.span`
  font-weight: 400;
  color: ${panelMutedText};
`;

const Preview = styled.span<{ $isUnread: boolean }>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: .85rem;
  line-height: 1.35;
  font-weight: ${({ $isUnread }) => ($isUnread ? 600 : 400)};
  color: ${({ $isUnread }) => ($isUnread ? panelText : panelMutedText)};
`;

const Meta = styled.span`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const Time = styled.span`
  font-size: .72rem;
  color: ${panelMutedText};
`;

const Unread = styled.span`
  min-width: 18px;
  height: 18px;
  box-sizing: border-box;
  padding: 0 5px;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  color: #FFF;
  background-color: ${colorDanger};
`;

export default {
  ChatListItem,
  Avatar,
  Text,
  Name,
  Offline,
  Preview,
  Meta,
  Time,
  Unread,
};
