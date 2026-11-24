import React, {
  memo,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { PANELS } from '/imports/ui/components/layout/enums';
import { layoutSelectInput } from '/imports/ui/components/layout/context';
import { Input } from '/imports/ui/components/layout/layoutTypes';
import SidebarNavigationButton from '/imports/ui/components/sidebar-navigation/sidebar-navigation-button/component';
import { useGenericContentBadgeIds } from '/imports/ui/core/local-states/useGenericContentBadges';
import AppsPopover from '/imports/ui/components/apps-gallery/popover/component';
import PopoverStyled from '/imports/ui/components/apps-gallery/popover/styles';
import NavigationDockContext from '../dock/context';
import useIsSpecificPanelOpened from '../hooks/useIsSpecificPanelOpened';

const intlMessages = defineMessages({
  wigetsLabel: {
    id: 'app.userList.appsTitle',
    description: 'Title for the apps panel',
  },
});

const AppsListItem: React.FC = () => {
  const intl = useIntl();
  const isDocked = useContext(NavigationDockContext);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const closePopover = useCallback(() => setIsPopoverOpen(false), []);
  const isPanelOpened = useIsSpecificPanelOpened(PANELS.APPS_GALLERY);
  const isOpened = isDocked ? isPopoverOpen : isPanelOpened;
  const label = intl.formatMessage(intlMessages.wigetsLabel);
  const badgedAppIds = useGenericContentBadgeIds();

  // A pinned app shows the badge on its own button and an open one needs no
  // reminder, so only badges hidden inside the gallery count. Derived inside the
  // selector so that layout changes re-render this button only when it flips.
  const hasHiddenAppBadge = layoutSelectInput((i: Input) => {
    if (isOpened) return false;
    const { registeredApps, pinnedApps } = i.sidebarNavigation;
    const { sidebarContent, sidebarContentAuxiliary } = i;
    return badgedAppIds.some((id) => {
      const appKey = PANELS.GENERIC_CONTENT_SIDEKICK + id;
      const isAppPanelOpened = (sidebarContent.isOpen === true && sidebarContent.sidebarContentPanel === appKey)
        || (sidebarContentAuxiliary.isOpen === true && sidebarContentAuxiliary.sidebarContentPanel === appKey);
      return Boolean(registeredApps?.[appKey])
        && !pinnedApps?.includes(appKey)
        && !isAppPanelOpened;
    });
  });

  // An unpinned app has no button of its own, so its notification shows here.
  const hasHiddenAppNotification = layoutSelectInput((i: Input) => {
    if (isOpened) return false;
    const { registeredApps, pinnedApps } = i.sidebarNavigation;
    return Object.entries(registeredApps ?? {}).some(([id, app]) => (
      Boolean(app?.hasNotification) && !pinnedApps?.includes(id)
    ));
  });

  const hasNotification = hasHiddenAppBadge || hasHiddenAppNotification;

  if (isDocked) {
    return (
      <PopoverStyled.Anchor ref={anchorRef}>
        <SidebarNavigationButton
          isOpened={isOpened}
          iconName="widgets"
          label={label}
          id="apps-gallery-toggle-button"
          ariaDescribedBy="appsGallery"
          dataTest="appsGallerySidebarButton"
          hasNotification={hasNotification}
          onClick={() => setIsPopoverOpen((open) => !open)}
        />
        {isPopoverOpen && <AppsPopover anchorRef={anchorRef} onClose={closePopover} />}
      </PopoverStyled.Anchor>
    );
  }

  return (
    <SidebarNavigationButton
      panel={PANELS.APPS_GALLERY}
      isOpened={isOpened}
      iconName="widgets"
      label={label}
      id="apps-gallery-toggle-button"
      ariaDescribedBy="appsGallery"
      dataTest="appsGallerySidebarButton"
      hasNotification={hasNotification}
    />
  );
};

export default memo(AppsListItem);
