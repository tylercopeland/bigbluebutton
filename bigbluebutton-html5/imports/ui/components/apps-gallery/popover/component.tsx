import React, {
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { defineMessages, useIntl } from 'react-intl';
import Styled from './styles';
import AppsPopoverItem from './item';
import { isPluginNew } from '../service';
import { ACTIONS, PANELS } from '/imports/ui/components/layout/enums';
import {
  layoutDispatch,
  layoutSelectInput,
  layoutSelectOutput,
} from '/imports/ui/components/layout/context';
import {
  InjectedAppGalleryItem,
  Input,
  Output,
} from '/imports/ui/components/layout/layoutTypes';
import useAnchoredLeft from '/imports/ui/components/actions-bar/media-area/media-sharing/hooks/useAnchoredLeft';
import useOpenTimerCard from '/imports/ui/components/timer/hooks/useOpenTimerCard';
import useMeetingSettings from '/imports/ui/core/local-states/useMeetingSettings';
import KEYS from '/imports/utils/keys';

const SEARCH_THRESHOLD = 8;

// BBB's own apps show as tiles, in this order; anything else goes in the list
const FEATURED_APPS: string[] = [PANELS.BREAKOUT, PANELS.POLL, PANELS.TIMER];

const intlMessages = defineMessages({
  title: {
    id: 'app.appsGallery.popover.title',
    description: 'Title for the apps popover',
    defaultMessage: 'Apps',
  },
  more: {
    id: 'app.appsGallery.popover.more',
    description: 'Heading for the apps that are not featured',
    defaultMessage: 'More apps',
  },
  empty: {
    id: 'app.appsGallery.popover.empty',
    description: 'Shown when there are no apps to list',
    defaultMessage: 'No apps available',
  },
  noResults: {
    id: 'app.appsGallery.popover.noResults',
    description: 'Shown when the search finds no apps',
    defaultMessage: 'No apps found',
  },
  search: {
    id: 'app.appsGallery.searchPlaceholder',
    description: 'Placeholder text for the search field',
  },
});

interface AppsPopoverProps {
  anchorRef: RefObject<HTMLElement>;
  onClose: () => void;
}

const AppsPopover: React.FC<AppsPopoverProps> = ({ anchorRef, onClose }) => {
  const intl = useIntl();
  const layoutContextDispatch = layoutDispatch();
  const openTimerCard = useOpenTimerCard();
  const [meetingSettings] = useMeetingSettings();
  const actionBar = layoutSelectOutput((i: Output) => i.actionBar);
  const {
    registeredApps = {},
    pinnedApps = [],
  } = layoutSelectInput((i: Input) => i.sidebarNavigation);

  const ref = useRef<HTMLDivElement>(null);
  const left = useAnchoredLeft(anchorRef, ref, true);
  const [searchQuery, setSearchQuery] = useState('');
  const newApps: string[] = meetingSettings?.public?.sidebarNavigation?.appsToLabelAsNew || [];

  const focusAnchor = () => {
    anchorRef.current?.querySelector<HTMLElement>('[role=button]')?.focus();
  };

  useEffect(() => {
    // Deferred, so the Enter key that opens the popover doesn't also press its
    // first button
    const timeout = setTimeout(() => {
      const target = ref.current?.querySelector<HTMLElement>('input, button') ?? ref.current;
      target?.focus();
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const isOutside = (target: EventTarget | null) => (
      target instanceof Node
      && !ref.current?.contains(target)
      && !anchorRef.current?.contains(target)
    );
    const onPointerDown = (event: PointerEvent) => {
      const isOverlay = event.target instanceof Element
        && event.target.hasAttribute('data-apps-overlay');
      // The overlay closes on click: closing here would let the press through
      if (!isOverlay && isOutside(event.target)) onClose();
    };
    const onFocusIn = (event: FocusEvent) => {
      if (isOutside(event.target)) onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== KEYS.ESCAPE) return;
      focusAnchor();
      onClose();
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const openApp = (appKey: string) => {
    const { onClick } = registeredApps[appKey] as InjectedAppGalleryItem;

    if (appKey === PANELS.TIMER) {
      openTimerCard();
    } else {
      focusAnchor();
      if (typeof onClick === 'function') {
        onClick();
      } else {
        layoutContextDispatch({ type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN, value: true });
        layoutContextDispatch({ type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL, value: appKey });
      }
    }
    onClose();
  };

  const appKeys = Object.keys(registeredApps);
  const query = searchQuery.trim().toLowerCase();
  const matches = (appKey: string) => (
    !query || registeredApps[appKey].name.toLowerCase().includes(query)
  );
  const featured = FEATURED_APPS.filter((appKey) => appKey in registeredApps && matches(appKey));
  const more = appKeys
    .filter((appKey) => !FEATURED_APPS.includes(appKey) && matches(appKey))
    .sort((a, b) => registeredApps[a].name.localeCompare(registeredApps[b].name));

  const renderItem = (appKey: string, isTile: boolean) => {
    const {
      name, icon, dataTest, pluginName, hasNotification,
    } = registeredApps[appKey];
    const isPinned = pinnedApps.includes(appKey);

    return (
      <AppsPopoverItem
        key={appKey}
        appKey={appKey}
        name={name}
        icon={icon}
        dataTest={dataTest}
        isTile={isTile}
        isPinned={isPinned}
        isNew={isPluginNew(pluginName) || newApps.includes(appKey)}
        hasNotification={!!hasNotification}
        onOpen={() => openApp(appKey)}
        onTogglePin={() => layoutContextDispatch({
          type: ACTIONS.SET_SIDEBAR_NAVIGATION_PIN_APP,
          value: { id: appKey, pin: !isPinned },
        })}
      />
    );
  };

  const title = intl.formatMessage(intlMessages.title);

  return (
    <>
      {/* Keeps the click that closes the popover from drawing on the slide. It
          leaves the actions bar free, so its buttons still work with one click. */}
      <Styled.Overlay data-apps-overlay style={{ height: actionBar?.top }} onClick={onClose} />
      <Styled.Popover
        ref={ref}
        role="dialog"
        aria-label={title}
        tabIndex={-1}
        data-test="appsPopover"
        style={{ left, bottom: actionBar?.height }}
      >
        <Styled.Title data-test="appsGalleryTitle">{title}</Styled.Title>
        {appKeys.length > SEARCH_THRESHOLD && (
          <Styled.Search
            type="search"
            value={searchQuery}
            placeholder={intl.formatMessage(intlMessages.search)}
            aria-label={intl.formatMessage(intlMessages.search)}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        )}
        <Styled.Content>
          {featured.length > 0 && (
            <Styled.Tiles>{featured.map((appKey) => renderItem(appKey, true))}</Styled.Tiles>
          )}
          {more.length > 0 && (
            <>
              {featured.length > 0 && (
                <Styled.Heading>{intl.formatMessage(intlMessages.more)}</Styled.Heading>
              )}
              <Styled.List>{more.map((appKey) => renderItem(appKey, false))}</Styled.List>
            </>
          )}
          {!featured.length && !more.length && (
            <Styled.Empty role="status">
              {intl.formatMessage(query ? intlMessages.noResults : intlMessages.empty)}
            </Styled.Empty>
          )}
        </Styled.Content>
      </Styled.Popover>
    </>
  );
};

export default AppsPopover;
