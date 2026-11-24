import React, { memo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import resolveIcon from '/imports/ui/components/plugins/plugin-icon/utils';
import Icon from '/imports/ui/components/common/icon/component';
import { PluginIconType } from 'bigbluebutton-html-plugin-sdk';
import { PANELS } from '/imports/ui/components/layout/enums';
import { useGenericContentBadge } from '/imports/ui/core/local-states/useGenericContentBadges';
import { useGenericContentMenuName } from '/imports/ui/core/local-states/useGenericContentMenuNames';
import Styled from './styles';

const intlMessages = defineMessages({
  pin: {
    id: 'app.appsGallery.popover.pin',
    description: 'Label for the button that pins an app to the bar',
    defaultMessage: 'Pin {name} to the bar',
  },
  unpin: {
    id: 'app.appsGallery.popover.unpin',
    description: 'Label for the button that unpins an app from the bar',
    defaultMessage: 'Unpin {name} from the bar',
  },
  newApp: {
    id: 'app.appsGallery.newAppLabel',
    description: 'Label that marks new apps',
  },
});

interface AppsPopoverItemProps {
  appKey: string;
  name: string;
  icon: PluginIconType;
  dataTest?: string;
  isTile: boolean;
  isPinned: boolean;
  isNew: boolean;
  hasNotification: boolean;
  onOpen: () => void;
  onTogglePin: () => void;
}

const AppsPopoverItem: React.FC<AppsPopoverItemProps> = ({
  appKey,
  name,
  icon,
  dataTest,
  isTile,
  isPinned,
  isNew,
  hasNotification,
  onOpen,
  onTogglePin,
}) => {
  const intl = useIntl();
  const contentId = appKey.replace(PANELS.GENERIC_CONTENT_SIDEKICK, '');
  const badge = useGenericContentBadge(contentId);
  const label = useGenericContentMenuName(contentId) ?? name;

  const Item = isTile ? Styled.Tile : Styled.Row;
  const Open = isTile ? Styled.TileButton : Styled.RowButton;
  const ItemIcon = isTile ? Styled.TileIcon : Styled.RowIcon;
  const Label = isTile ? Styled.TileLabel : Styled.RowLabel;
  const pinLabel = intl.formatMessage(
    isPinned ? intlMessages.unpin : intlMessages.pin,
    { name: label },
  );

  return (
    <Item data-test={dataTest ? `apps_gallery_item_${dataTest}` : undefined}>
      <Open type="button" onClick={onOpen} data-test={`${appKey}AppsPopoverButton`}>
        <ItemIcon aria-hidden="true" $appKey={appKey}>
          {resolveIcon(icon)}
          {hasNotification && <Styled.Dot />}
        </ItemIcon>
        <Label>{label}</Label>
        {badge && <Styled.Badge>{badge}</Styled.Badge>}
        {isNew && <Styled.Badge>{intl.formatMessage(intlMessages.newApp)}</Styled.Badge>}
      </Open>
      <Styled.Pin
        type="button"
        $tile={isTile}
        $pinned={isPinned}
        aria-label={pinLabel}
        title={pinLabel}
        onClick={onTogglePin}
      >
        <Icon iconName={isPinned ? 'pin-video_on' : 'pin-video_off'} />
      </Styled.Pin>
    </Item>
  );
};

export default memo(AppsPopoverItem);
