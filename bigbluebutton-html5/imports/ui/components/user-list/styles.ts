import styled from 'styled-components';

import { FlexColumn } from '/imports/ui/stylesheets/styled-components/placeholders';
import {
  userListBg,
  userListText,
  colorGray,
  listItemBgHover,
  itemFocusBorder,
  panelMutedText,
  panelRaisedHandText,
} from '/imports/ui/stylesheets/styled-components/palette';
import {
  smPaddingX,
  mdPadding,
  borderSize,
  contentSidebarBottomScrollPadding,
} from '/imports/ui/stylesheets/styled-components/general';
import {
  PanelContent as BasePanelContent,
  Separator as BaseSeparator,
} from '/imports/ui/components/sidebar-content/styles';
import { ScrollboxVertical } from '/imports/ui/stylesheets/styled-components/scrollable';

const PanelContent = styled(BasePanelContent)`
  display: flex;
  flex-direction: column;
`;

const Separator = styled(BaseSeparator)``;

const ScrollableSection = styled(ScrollboxVertical)`
  flex-grow: 1;
  padding-bottom: ${contentSidebarBottomScrollPadding};
  margin: ${mdPadding};
  margin-top: 0;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 8px 4px;
`;

const SectionTitle = styled.h2<{ $isRaisedHands?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  margin: 0;
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: ${({ $isRaisedHands }) => ($isRaisedHands ? panelRaisedHandText : panelMutedText)};
`;

const SectionCount = styled.span`
  font-weight: 600;
  color: ${panelMutedText};
`;

const Everyone = styled.div`
  &[hidden] {
    display: none;
  }
`;

const EmptyMessage = styled.div`
  padding: 24px 8px;
  text-align: center;
  font-size: .9rem;
  color: ${panelMutedText};
`;

const UserList = styled(FlexColumn)`
  justify-content: flex-start;
  background-color: ${userListBg};
  color: ${userListText};
  height: 100%;
`;

const SmallTitle = styled.h2`
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0 ${smPaddingX};
  color: ${colorGray};
  flex: 1;
  margin: 0;
`;

const Messages = styled.div`
  flex-grow: 0;
  display: flex;
  flex-flow: column;
  flex-shrink: 0;
  max-height: 30vh;
`;

const ListItem = styled.div`
  display: flex;
  flex-flow: row;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  cursor: pointer;

  [dir="rtl"] & {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  &:first-child {
    margin-top: 0;
  }

  &:hover {
    outline: transparent;
    outline-style: dotted;
    outline-width: ${borderSize};
    background-color: ${listItemBgHover};
  }

  &:active,
  &:focus {
    outline: transparent;
    outline-width: ${borderSize};
    outline-style: solid;
    background-color: ${listItemBgHover};
    box-shadow: inset 0 0 0 ${borderSize} ${itemFocusBorder}, inset 1px 0 0 1px ${itemFocusBorder};
  }
`;

export default {
  PanelContent,
  Separator,
  ScrollableSection,
  SectionHeader,
  SectionTitle,
  SectionCount,
  Everyone,
  EmptyMessage,
  UserList,
  SmallTitle,
  ListItem,
  Messages,
};
