import styled from 'styled-components';
import {
  Separator as BaseSeparator,
} from '/imports/ui/components/sidebar-content/styles';
import { smPaddingX, smPaddingY } from '/imports/ui/stylesheets/styled-components/general';
import { CircularProgress } from '@mui/material';
import { colorWhite, colorPrimary, panelMutedText } from '/imports/ui/stylesheets/styled-components/palette';
import { smallOnly } from '/imports/ui/stylesheets/styled-components/breakpoints';

interface ChatProps {
  isChrome: boolean;
  isRTL: boolean;
}

export const Chat = styled.div<ChatProps>`
  background-color: ${colorWhite};
  padding: ${smPaddingX};
  padding-bottom: ${smPaddingY};
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: space-around;
  overflow: hidden;
  height: 100%;
  user-select: none;

  ${({ isRTL }) => isRTL && `
    padding-left: 0.1rem;
  `}

  ${({ isRTL }) => !isRTL && `
    padding-right: 0.1rem;
  `}

  a {
    color: ${colorPrimary};
    text-decoration: none;

    &:focus {
      color: ${colorPrimary};
      text-decoration: underline;
    }
    &:hover {
      filter: brightness(90%);
      text-decoration: underline;
    }
    &:active {
      filter: brightness(85%);
      text-decoration: underline;
    }
    &:hover:focus {
      filter: brightness(90%);
      text-decoration: underline;
    }
    &:focus:active {
      filter: brightness(85%);
      text-decoration: underline;
    }
  }
  u {
    text-decoration-line: none;
  }

  ${({ isChrome }) => isChrome && `
    transform: translateZ(0);
  `}

  @media ${smallOnly} {
    transform: none !important;
  }
`;

const ChatMessages = styled.div`
  user-select: text;
`;

const Separator = styled(BaseSeparator)``;

const PrivacyNote = styled.p`
  flex-shrink: 0;
  align-self: center;
  max-width: 260px;
  margin: 0;
  text-align: center;
  font-size: .8rem;
  line-height: 1.4;
  color: ${panelMutedText};
  overflow-wrap: anywhere;
`;

const LoadingWrapper = styled.div`
  justify-content: center;
  display: flex;
  flex-grow: 1;
`;

const CircularProgressContainer = styled(CircularProgress)`
  align-self: center;
`;

const ContentWrapper = styled.div`
  padding: 12px 14px 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;
`;

export default {
  ChatMessages,
  Separator,
  PrivacyNote,
  LoadingWrapper,
  CircularProgressContainer,
  ContentWrapper,
};
