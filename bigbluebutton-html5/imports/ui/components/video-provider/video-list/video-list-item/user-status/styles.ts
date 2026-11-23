// @ts-nocheck
/* eslint-disable */
import styled, { css } from 'styled-components';
import Icon from '/imports/ui/components/common/icon/component';
import { roomLive, roomMutedText, webcamLabelBg } from '/imports/ui/stylesheets/styled-components/palette';

const badge = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 1.25rem;
  width: 1.25rem;
  border-radius: 5px;
  margin-inline-start: 4px;
  background-color: ${webcamLabelBg};

  &::before {
    font-size: 75%;
  }
`;

const Voice = styled(Icon)`
  ${badge}
  color: ${roomLive};
`;

const Muted = styled(Icon)`
  ${badge}
  color: ${roomMutedText};
`;

export default {
  Voice,
  Muted,
};
