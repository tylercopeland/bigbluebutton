import styled from 'styled-components';
import UserAvatar from '/imports/ui/components/user-avatar/component';
import {
  panelBorder,
  panelMutedText,
  panelRowHoverBg,
  panelText,
  roomFocusRing,
} from '/imports/ui/stylesheets/styled-components/palette';

const Header = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 10px;
  margin: 0 -14px;
  padding: 0 12px 10px;
  border-bottom: 1px solid ${panelBorder};
`;

const Back = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: ${panelText};
  cursor: pointer;

  &:hover {
    background-color: ${panelRowHoverBg};
  }

  &:focus-visible {
    outline: 2px solid ${roomFocusRing};
  }

  [dir="rtl"] & svg {
    transform: scaleX(-1);
  }
`;

const Avatar = styled(UserAvatar)`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border: 0;
  font-size: .75rem;
  font-weight: 700;
`;

const Text = styled.div`
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

const Sub = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: .78rem;
  color: ${panelMutedText};
`;

export default {
  Header,
  Back,
  Avatar,
  Text,
  Name,
  Sub,
};
