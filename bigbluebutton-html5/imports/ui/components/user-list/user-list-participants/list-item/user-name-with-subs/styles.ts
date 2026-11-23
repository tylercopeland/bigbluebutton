import styled from 'styled-components';
import {
  colorPrimary,
  panelMutedText,
  panelRaisedHandText,
  panelText,
} from '/imports/ui/stylesheets/styled-components/palette';
import { smPaddingX } from '/imports/ui/stylesheets/styled-components/general';
import Icon from '/imports/ui/components/common/icon/icon-ts/component';
import { PluginButtonIcon } from '/imports/ui/components/plugins/plugin-icon/styles';

const UserNameContainer = styled.div`
  display: flex;
  flex-flow: column;
  flex: 1 1 auto;
  min-width: 0;
  justify-content: center;
`;

const UserName = styled.span`
  display: block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: .9375rem;
  line-height: 1.25;
  font-weight: 600;
  color: ${panelText};
  /* Truncate at the end of the name, whichever way it is written */
  unicode-bidi: plaintext;
  text-align: left;

  [dir="rtl"] & {
    text-align: right;
  }
`;

const You = styled.span`
  font-weight: 500;
  color: ${panelMutedText};
`;

const UserNameSub = styled.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: .78rem;
  line-height: 1.35;
  font-weight: 400;
  color: ${panelMutedText};

  i {
    line-height: 0;
    font-size: 75%;
  }

  svg {
    vertical-align: -1px;
    margin-inline-end: 4px;
  }
`;

const RaisedHand = styled.span`
  color: ${panelRaisedHandText};
`;

const Presenter = styled.span`
  color: ${colorPrimary};
`;

const UserAdditionalInformationIcon = styled(Icon)`
  margin-right: ${smPaddingX};
`;

const SvgContentUserListIcon = styled(PluginButtonIcon)`
  display: inline-flex;
  align-items: center;
`;

const SvgContentUserListIconMargin = styled(PluginButtonIcon)`
  margin-right: ${smPaddingX};
`;

export default {
  UserNameContainer,
  UserName,
  UserNameSub,
  You,
  RaisedHand,
  Presenter,
  UserAdditionalInformationIcon,
  SvgContentUserListIcon,
  SvgContentUserListIconMargin,
};
