import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useShortcut } from '/imports/ui/core/hooks/useShortcut';
import { User } from '/imports/ui/Types/user';
import { BackIcon, LockIcon } from '../icons/component';
import Styled from './styles';

const intlMessages = defineMessages({
  back: {
    id: 'app.chat.direct.back',
    description: 'Label for the button that returns to the list of private chats',
    defaultMessage: 'Back to direct messages',
  },
  directMessage: {
    id: 'app.chat.direct.label',
    description: 'Identifies a conversation as private',
    defaultMessage: 'Direct message',
  },
  offline: {
    id: 'app.chat.offline',
    description: 'Offline',
  },
});

interface BackButtonProps {
  onClick: () => void;
  participant?: User;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, participant }) => {
  const intl = useIntl();
  const CLOSE_CHAT_AK = useShortcut('closeprivatechat');
  const name = participant?.name ?? '';
  const isOffline = participant?.currentlyInMeeting === false;

  return (
    <Styled.Header>
      {/* eslint-disable-next-line jsx-a11y/no-access-key */}
      <Styled.Back
        type="button"
        onClick={onClick}
        data-test="privateChatBackButton"
        accessKey={CLOSE_CHAT_AK}
        aria-label={intl.formatMessage(intlMessages.back)}
      >
        <BackIcon />
      </Styled.Back>
      {participant && (
        <Styled.Avatar
          moderator={participant.isModerator}
          avatar={participant.avatar}
        >
          {/* @ts-ignore - UserAvatar is JS, so its inferred children type is null */}
          <span>{participant.avatar?.length ? '' : name.toLowerCase().slice(0, 2)}</span>
        </Styled.Avatar>
      )}
      <Styled.Text>
        <Styled.Name title={name}><bdi>{name}</bdi></Styled.Name>
        <Styled.Sub>
          <LockIcon />
          <span>{intl.formatMessage(intlMessages.directMessage)}</span>
          {isOffline && <span>{`(${intl.formatMessage(intlMessages.offline)})`}</span>}
        </Styled.Sub>
      </Styled.Text>
    </Styled.Header>
  );
};

export default BackButton;
