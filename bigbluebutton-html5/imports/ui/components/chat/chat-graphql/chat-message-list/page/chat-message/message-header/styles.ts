import styled from 'styled-components';

import {
  colorGrayLight,
  colorGrayDark,
  panelMutedText,
  panelText,
} from '/imports/ui/stylesheets/styled-components/palette';
import { fontSizeSmaller, lineHeightComputed } from '/imports/ui/stylesheets/styled-components/typography';

interface ChatUserNameProps {
  currentlyInMeeting: boolean;
}

export const HeaderContent = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  width: 100%;
`;

export const ChatUserName = styled.div<ChatUserNameProps>`
  display: flex;
  min-width: 0;
  font-weight: 700;
  font-size: .875rem;
  line-height: 1.3;
  position: relative;
  margin-inline-end: 6px;

  min-width: 0;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;

  ${({ currentlyInMeeting }) => currentlyInMeeting && `
    color: ${panelText};
  `}

  ${({ currentlyInMeeting }) => !currentlyInMeeting && `
    text-transform: capitalize;
    font-style: italic;

    & > span {
      text-align: right;
      padding: 0 .1rem 0 0;

      [dir="rtl"] & {
        text-align: left;
        padding: 0 0 0 .1rem;
      }
    }
  `}
`;

export const ChatUserOffline = styled.span`
  color: ${colorGrayLight};
  font-weight: 100;
  text-transform: lowercase;
  font-style: italic;
  font-size: 85%;
  line-height: 1;
  user-select: none;
  margin-inline-end: 6px;
`;

export const ChatTime = styled.time`
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: max-content;
  color: ${panelMutedText};
  font-size: .75rem;

  & > span {
    vertical-align: sub;
  }
`;

export const ChatHeaderText = styled.div`
  display: flex;
  align-items: baseline;
  width: 100%;
`;

export const EditLabel = styled.span`
  color: ${colorGrayLight};
  font-size: ${fontSizeSmaller};
  display: flex;
  align-items: center;
  gap: calc(${lineHeightComputed} / 4);

  [dir='ltr'] & {
    margin-right: calc(${lineHeightComputed} / 2);
  }

  [dir='rtl'] & {
    margin-left: calc(${lineHeightComputed} / 2);
  }
`;

export const Center = styled.div`
  flex-grow: 1;
`;

export const HeaderActions = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  flex-shrink: 0;
  margin-left: 0.15rem;
`;

export const PollHeaderAction = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.1rem 0.2rem;
  display: inline-flex;
  align-items: center;
  color: ${colorGrayLight};
  font-size: 0.9rem;
  border-radius: 0.2rem;
  line-height: 1;

  &:hover,
  &:focus {
    color: ${colorGrayDark};
    background-color: rgba(0, 0, 0, 0.08);
    outline: none;
  }
`;

export default {
  HeaderContent,
  ChatTime,
  ChatUserOffline,
  ChatUserName,
  ChatHeaderText,
  EditLabel,
  Center,
  HeaderActions,
  PollHeaderAction,
};
