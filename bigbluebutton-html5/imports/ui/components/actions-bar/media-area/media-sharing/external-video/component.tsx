import React from 'react';
import { defineMessages, IntlShape } from 'react-intl';
import TextField from '@mui/material/TextField';
import Styled from './styles';
import ModalStyled from '../styles';
import Icon from '/imports/ui/components/common/icon/component';
import { BBButton } from '@bigbluebutton/bbb-ui-components-react';
import { isUrlValid, startWatching } from '/imports/ui/components/external-video-player/service';
import { useMutation } from '@apollo/client';
import { EXTERNAL_VIDEO_START } from '/imports/ui/components/external-video-player/mutations';

const intlMessages = defineMessages({
  shareLabel: {
    id: 'app.mediaSharing.modal.share',
    description: 'Label for the share button in the sharing media modal',
  },
  stopSharingLabel: {
    id: 'app.mediaSharing.modal.stopSharing',
    description: 'Label for the stop sharing button in the sharing media modal',
  },
  urlError: {
    id: 'app.externalVideo.urlError',
    description: 'Not a video URL error',
  },
  urlInput: {
    id: 'app.externalVideo.urlInput',
    description: 'URL input field placeholder',
  },
  videoLink: {
    id: 'app.mediaSharing.tray.videoLink',
    description: 'Label of the video link field',
    defaultMessage: 'Video link',
  },
  shareVideo: {
    id: 'app.mediaSharing.tray.shareVideo',
    description: 'Label for the button that shares the video link',
    defaultMessage: 'Share video',
  },
  noteSupported: {
    id: 'app.externalVideo.noteLabelSupported',
    description: 'provides hint about supported Shared External videos',
  },
  noteWarning: {
    id: 'app.externalVideo.noteLabelWarning',
    description: 'provides hint that shared videos are not in the recording',
  },
});

interface ExternalVideoViewProps {
  intl: IntlShape;
  isSharingVideo: boolean;
  onActionCompleted: () => void;
  stopExternalVideoShare: () => void;
  /** Compact look for the Share media tray */
  isTray?: boolean;
}

const ExternalVideoView: React.FC<ExternalVideoViewProps> = ({
  intl,
  onActionCompleted,
  isSharingVideo,
  stopExternalVideoShare,
  isTray = false,
}) => {
  const [videoUrl, setVideoUrl] = React.useState('');
  const [startExternalVideoMutation] = useMutation(EXTERNAL_VIDEO_START);
  const startWatchingImp = startWatching(startExternalVideoMutation);

  const valid = isUrlValid(videoUrl);

  const canStartSharing = (videoUrl !== '' && valid) && !isSharingVideo;

  if (isTray) {
    const hasError = !valid && videoUrl !== '';
    return (
      <Styled.TrayForm
        onSubmit={(event) => {
          event.preventDefault();
          if (!canStartSharing) return;
          startWatchingImp(videoUrl);
          onActionCompleted();
        }}
      >
        <Styled.TrayLabel htmlFor="external-video-url-input">
          {intl.formatMessage(intlMessages.videoLink)}
        </Styled.TrayLabel>
        <Styled.TrayInput
          id="external-video-url-input"
          data-test="externalVideoUrlInput"
          type="url"
          dir="ltr"
          autoComplete="off"
          value={videoUrl}
          disabled={isSharingVideo}
          $hasError={hasError}
          aria-invalid={hasError}
          aria-describedby="external-video-note"
          placeholder={intl.formatMessage(intlMessages.urlInput)}
          onChange={(event) => setVideoUrl(event.target.value.trim())}
        />
        <Styled.TrayRow>
          <Styled.TrayNote id="external-video-note" $hasError={hasError} aria-live="polite">
            {intl.formatMessage(hasError ? intlMessages.urlError : intlMessages.noteWarning)}
          </Styled.TrayNote>
          <Styled.TrayButton
            type="submit"
            data-test="ShareExternalVideo"
            disabled={!canStartSharing}
          >
            {intl.formatMessage(intlMessages.shareVideo)}
          </Styled.TrayButton>
        </Styled.TrayRow>
      </Styled.TrayForm>
    );
  }

  return (
    <>
      <Styled.Content>
        <ModalStyled.SubViewContentText>
          <TextField
            sx={{ marginBottom: '0rem' }}
            error={!valid && videoUrl !== ''}
            helperText={!valid && videoUrl !== '' ? intl.formatMessage(intlMessages.urlError) : ''}
            value={videoUrl}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setVideoUrl(event.target.value.trim());
            }}
            id="external-video-url-input"
            inputProps={{ 'data-test': 'externalVideoUrlInput' } as React.InputHTMLAttributes<HTMLInputElement>}
            placeholder={intl.formatMessage(intlMessages.urlInput)}
            variant="standard"
            fullWidth
          />
          <Styled.NoteContainer>
            <span>{intl.formatMessage(intlMessages.noteSupported)}</span>
            <span>{intl.formatMessage(intlMessages.noteWarning)}</span>
          </Styled.NoteContainer>
        </ModalStyled.SubViewContentText>
      </Styled.Content>
      <ModalStyled.FooterContainer>
        <BBButton
          dataTest={!isSharingVideo ? 'ShareExternalVideo' : 'StopSharingExternalVideo'}
          label={!isSharingVideo
            ? intl.formatMessage(intlMessages.shareLabel) : intl.formatMessage(intlMessages.stopSharingLabel)}
          variant="primary"
          color={!isSharingVideo ? 'default' : 'danger'}
          onClick={() => {
            if (!isSharingVideo) {
              startWatchingImp(videoUrl);
              onActionCompleted();
            } else {
              stopExternalVideoShare();
            }
          }}
          disabled={!canStartSharing && !isSharingVideo}
          iconStart={isSharingVideo ? <Icon iconName="external-video_off" /> : undefined}
          fullWidth
        />
      </ModalStyled.FooterContainer>
    </>
  );
};

export default ExternalVideoView;
