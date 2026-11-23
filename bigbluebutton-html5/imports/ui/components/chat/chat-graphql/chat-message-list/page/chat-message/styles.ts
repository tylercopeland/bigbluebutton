import styled, { css } from 'styled-components';

import {
  $3xlPadding,
  xlPadding,
  mdPadding,
  smPadding,
} from '/imports/ui/stylesheets/styled-components/general';
import { fontSizeBase } from '/imports/ui/stylesheets/styled-components/typography';

import {
  colorBlueLightest,
  colorGrayLight,
  colorBorder,
  colorGrayDark,
  colorWhite,
  colorSelectedCorrectAnswerText,
  emphasizedMessageBackgroundColor,
  highlightedMessageBorderColor,
  systemMessageBorderColor,
  chatBubbleBg,
  chatOwnBubbleBg,
  panelMutedText,
  panelRowHoverBg,
} from '/imports/ui/stylesheets/styled-components/palette';
import { ChatTime as ChatTimeBase } from './message-header/styles';
import { IconWrapper as ReadConfirmationIconWrapper, ReadIcon } from './message-read-confirmation/styles';
import { Root as ToolbarRoot } from './message-toolbar/styles';
import { ChatMessage as TextMessage } from './message-content/text-content/styles';
import RepliedStyled from './message-replied/styles';
import UserAvatar from '/imports/ui/components/user-avatar/component';

interface ChatWrapperProps {
  sameSender: boolean;
  messageHighlight: boolean;
  isPresentationUpload?: boolean;
  isCustomPluginMessage: boolean;
  $bubble: Bubble;
}

// Private conversations show bubbles, aligned by who wrote the message
export type Bubble = 'own' | 'other' | null;

const { Container: RepliedMessage } = RepliedStyled;

const AVATAR_COLUMN = '32px';

interface ChatMessageContentWrapperProps {
  sameSender: boolean;
  isCustomPluginMessage: boolean;
  $isSystemSender: boolean;
  $editing: boolean;
  $highlight: boolean;
  $reactionPopoverIsOpen: boolean;
  $keyboardFocused: boolean;
  $emphasizedMessage: boolean;
  $isIndented: boolean;
  $isDeleted: boolean;
  $bubble: Bubble;
}

export const FlexColumn = styled.div`
  display: flex;
  flex-flow: column;
  gap: 2px;
  align-items: inherit;
`;

export const ChatWrapper = styled.div<ChatWrapperProps>`
  pointer-events: auto;
  display: flex;
  flex-flow: column;
  gap: 2px;
  position: relative;
  font-size: ${fontSizeBase};

  ${({ $bubble }) => $bubble && `
    max-width: 85%;
    align-items: ${$bubble === 'own' ? 'flex-end' : 'flex-start'};
  `}

  [dir='rtl'] & {
    direction: rtl;
  }

  ${({ isPresentationUpload }) => isPresentationUpload && `
      border: 1px solid ${systemMessageBorderColor};
      border-radius: 8px;
      background-color: ${colorWhite};
    `}
  ${({ messageHighlight }) => messageHighlight && `
    background-color: #fef9f1;
    border-left: 2px solid ${colorSelectedCorrectAnswerText};
    border-radius: 0px 3px 3px 0px;
    padding: 8px 2px;
  `}
  ${({ isCustomPluginMessage }) => isCustomPluginMessage && `
    margin: 0;
    padding: 0;
  `}
`;

export const ChatMessageContentWrapper = styled.div<ChatMessageContentWrapperProps>`
  display: flex;
  flex-flow: column;
  width: 100%;
  border-radius: 0.5rem;
  position: relative;
  border: 1px solid transparent;

  /* Lines up with the name, past the avatar */
  ${({ $isIndented }) => $isIndented && `
    width: auto;
    margin-inline-start: ${AVATAR_COLUMN};
  `}

  ${({ $highlight, isCustomPluginMessage, $bubble }) => ($highlight && !isCustomPluginMessage && !$bubble) && `
    background-color: ${colorWhite};

    &:hover {
      background-color: ${panelRowHoverBg};
    }
  `}

  ${({
    $editing, $reactionPopoverIsOpen, $keyboardFocused,
    isCustomPluginMessage,
  }) => !isCustomPluginMessage && ($reactionPopoverIsOpen || $editing || $keyboardFocused)
    && `
    background-color: ${colorBlueLightest} !important;
  `}

  .chat-message-container:focus & {
    background-color: ${colorBlueLightest} !important;
  }

  ${({ $emphasizedMessage, isCustomPluginMessage }) => (!isCustomPluginMessage && $emphasizedMessage) && `
    background-color: ${emphasizedMessageBackgroundColor};

    &:hover {
      border: 1px solid ${highlightedMessageBorderColor};
    }
  `}

  ${({ $bubble }) => $bubble && css`
    width: auto;
    max-width: 100%;
    border-radius: 14px;

    /* A short bubble is narrower than the toolbar, which must not leave the panel */
    && > ${ToolbarRoot} {
      right: auto;
      left: auto;
      transform: translateY(20%);
      ${$bubble === 'own' ? 'inset-inline-end: 0;' : 'inset-inline-start: 0;'}
    }
  `}

  ${({ $bubble }) => $bubble && css`
    > ${RepliedMessage} {
      margin: 6px 6px 0;
      border-radius: 9px;
    }
  `}

  ${({ $bubble }) => $bubble === 'other' && `
    background-color: ${chatBubbleBg};
  `}

  ${({ $bubble, $isDeleted }) => $bubble === 'own' && !$isDeleted && css`
    &&, .chat-message-container:focus && {
      background-color: ${chatOwnBubbleBg} !important;
    }

    ${TextMessage} {
      color: #FFF;
    }

    ${TextMessage} a,
    ${ReadIcon} {
      color: #FFF;
    }

    ${TextMessage} a {
      text-decoration: underline;
    }

    ${TextMessage} pre {
      color: ${colorGrayDark};
    }
  `}
`;

export const ChatContentFooter = styled.div`
  justify-content: flex-end;
  gap: 0.25rem;
  position: absolute;
  bottom: 0.25rem;
  line-height: 1;
  font-size: 95%;
  display: none;
  background-color: inherit;
  border-radius: 0.5rem;

  [dir="rtl"] & {
    left: 0.25rem;
  }

  [dir="ltr"] & {
    right: 0.25rem;
  }

  /* keep clear of the read check: message padding + check (1rem glyph) + gap */
  [dir="rtl"] .chat-message-content:has(${ReadConfirmationIconWrapper}) & {
    left: calc(${$3xlPadding} + 1rem + ${smPadding});
  }

  [dir="ltr"] .chat-message-content:has(${ReadConfirmationIconWrapper}) & {
    right: calc(${$3xlPadding} + 1rem + ${smPadding});
  }

  .chat-message-wrapper-focused &,
  .chat-message-wrapper-keyboard-focused &,
  .chat-message-content:focus &,
  .chat-message-content:hover & {
    display: flex;
  }
`;

export const ChatAvatar = styled(UserAvatar)`
  && {
    position: absolute;
  }

  top: 0;
  inset-inline-start: 0;
  width: 28px;
  height: 28px;
  text-align: center;
  font-size: .68rem;
  font-weight: 700;
  border: 0;
  user-select: none;
`;

export const Container = styled.div<{ $sequence: number; $sameSender: boolean; $bubble: Bubble }>`
  display: flex;
  flex-direction: column;
  user-select: text;
  outline: none;

  &:not(:first-of-type) {
    margin-top: ${({ $sameSender }) => ($sameSender ? '2px' : '12px')};
  }

  ${({ $bubble }) => $bubble && `
    align-items: ${$bubble === 'own' ? 'flex-end' : 'flex-start'};
  `}

  &[data-focusable="false"] {
    pointer-events: none;
  }
`;

export const MessageItemWrapper = styled.div<{ $bubble: Bubble }>`
  display: flex;
  flex-direction: row;
  padding: ${({ $bubble }) => ($bubble ? '7px 12px' : '2px 5px')};
  font-size: .9375rem;
  line-height: 1.4;
`;

export const PluginInformationMetadata = styled.div`
  font-size: 75%;
  font-style: italic;
  color: ${colorGrayDark};
  padding: 0 .25rem 0 0;
  text-align: end;
`;

export const DeleteMessage = styled.span`
  color: ${colorGrayLight};
  padding: ${mdPadding} ${xlPadding};
  border: 1px solid ${colorBorder};
  border-radius: 0.375rem;
`;

export const ChatHeading = styled.div<{ $hasAvatar: boolean }>`
  display: flex;
  min-height: 18px;

  ${({ $hasAvatar }) => $hasAvatar && `
    padding-inline-start: 38px;
  `}
`;

export const EditLabel = styled.span`
  color: ${colorGrayLight};
  font-style: italic;
  font-size: 75%;
  display: flex;
  align-items: center;
  gap: 0.125rem;
  line-height: 1;
`;

export const ChatTime = styled(ChatTimeBase)`
  font-style: italic;
  color: ${colorGrayDark};
  display: none;

  .chat-message-container:focus &,
  .chat-message-container-keyboard-focused &,
  .chat-message-content:hover & {
    display: flex;
  }
`;

// Time and edit state below the bubbles of a private conversation
export const BubbleMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: .72rem;
  color: ${panelMutedText};
`;
