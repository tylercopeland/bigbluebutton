import React, {
  RefObject,
  useEffect,
  useLayoutEffect,
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
import Icon from '/imports/ui/components/common/icon/component';
import Session from '/imports/ui/services/storage/in-memory';
import { useIsQuizEnabled } from '/imports/ui/services/features';
import { POLL_START_AS_QUIZ } from '/imports/ui/components/poll/constants';
import useOpenTimerCard from '/imports/ui/components/timer/hooks/useOpenTimerCard';
import useMeetingSettings from '/imports/ui/core/local-states/useMeetingSettings';
import KEYS from '/imports/utils/keys';

const SEARCH_THRESHOLD = 8;

// BBB's own apps show as tiles, in this order; anything else goes in the list
const FEATURED_APPS: string[] = [PANELS.BREAKOUT, PANELS.POLL, PANELS.TIMER];

const VIEWPORT_MARGIN = 8;

type CatalogId = 'qna' | 'quiz' | 'wordCloud' | 'randomPicker';
interface CatalogEntry { id: CatalogId; icon: string }

// The list under "More plugins". Quiz starts from Polling; the others have no
// version built into the client yet, so they are shown as not available.
const CATALOG: CatalogEntry[] = [
  { id: 'qna', icon: 'questions' },
  { id: 'quiz', icon: 'polling' },
  { id: 'wordCloud', icon: 'text_tool' },
  { id: 'randomPicker', icon: 'random' },
];

const intlMessages = defineMessages({
  title: {
    id: 'app.appsGallery.popover.title',
    description: 'Title for the plugins popover',
    defaultMessage: 'Plugins',
  },
  more: {
    id: 'app.appsGallery.popover.more',
    description: 'Heading for the plugins that are not featured',
    defaultMessage: 'More plugins',
  },
  featuredBreakout: {
    id: 'app.appsGallery.popover.featured.breakout',
    description: 'Label for the breakout rooms card in the plugins popover',
    defaultMessage: 'Breakout rooms',
  },
  featuredPoll: {
    id: 'app.appsGallery.popover.featured.poll',
    description: 'Label for the poll card in the plugins popover',
    defaultMessage: 'Poll',
  },
  featuredTimer: {
    id: 'app.appsGallery.popover.featured.timer',
    description: 'Label for the timer card in the plugins popover',
    defaultMessage: 'Timer',
  },
  qna: {
    id: 'app.appsGallery.popover.qna',
    description: 'Name of the Q&A board plugin',
    defaultMessage: 'Q&A board',
  },
  qnaDescription: {
    id: 'app.appsGallery.popover.qnaDescription',
    description: 'One line description of the Q&A board plugin',
    defaultMessage: 'Collect and upvote questions',
  },
  quiz: {
    id: 'app.appsGallery.popover.quiz',
    description: 'Name of the quiz plugin',
    defaultMessage: 'Quiz',
  },
  quizDescription: {
    id: 'app.appsGallery.popover.quizDescription',
    description: 'One line description of the quiz plugin',
    defaultMessage: 'Questions with correct answers',
  },
  wordCloud: {
    id: 'app.appsGallery.popover.wordCloud',
    description: 'Name of the word cloud plugin',
    defaultMessage: 'Word cloud',
  },
  wordCloudDescription: {
    id: 'app.appsGallery.popover.wordCloudDescription',
    description: 'One line description of the word cloud plugin',
    defaultMessage: 'See the words everyone sends',
  },
  randomPicker: {
    id: 'app.appsGallery.popover.randomPicker',
    description: 'Name of the random picker plugin',
    defaultMessage: 'Random picker',
  },
  randomPickerDescription: {
    id: 'app.appsGallery.popover.randomPickerDescription',
    description: 'One line description of the random picker plugin',
    defaultMessage: 'Pick someone at random',
  },
  notAvailable: {
    id: 'app.appsGallery.popover.notAvailable',
    description: 'Shown instead of the description for a plugin that is not installed',
    defaultMessage: 'Not available on this server',
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
  const isQuizEnabled = useIsQuizEnabled();
  const [left, setLeft] = useState<number | undefined>(undefined);

  // Anchored above the actions bar, at its first button, not at the button that opened it
  useLayoutEffect(() => {
    const update = () => {
      const bar = anchorRef.current?.closest('#ActionsBar') ?? anchorRef.current;
      const first = bar?.querySelector('.bbb-navigation__item') ?? anchorRef.current;
      const width = ref.current?.offsetWidth ?? 0;
      if (!first || !width) return;
      const max = window.innerWidth - width - VIEWPORT_MARGIN;
      setLeft(Math.round(Math.max(VIEWPORT_MARGIN, Math.min(first.getBoundingClientRect().left, max))));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(document.documentElement);
    const bar = anchorRef.current?.closest('#ActionsBar');
    if (bar) observer.observe(bar);
    return () => observer.disconnect();
  }, []);
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

  const openCatalogEntry = (id: CatalogId) => {
    if (id !== 'quiz' || !isQuizEnabled || !(PANELS.POLL in registeredApps)) return;
    Session.setItem(POLL_START_AS_QUIZ, true);
    openApp(PANELS.POLL);
  };

  const isCatalogAvailable = (id: CatalogId) => (
    id === 'quiz' && isQuizEnabled && PANELS.POLL in registeredApps
  );

  const featuredLabels: Record<string, string> = {
    [PANELS.BREAKOUT]: intl.formatMessage(intlMessages.featuredBreakout),
    [PANELS.POLL]: intl.formatMessage(intlMessages.featuredPoll),
    [PANELS.TIMER]: intl.formatMessage(intlMessages.featuredTimer),
  };

  const renderCatalogEntry = ({ id, icon }: CatalogEntry) => {
    const isAvailable = isCatalogAvailable(id);
    const name = intl.formatMessage(intlMessages[id]);
    const description = isAvailable
      ? intl.formatMessage(intlMessages[`${id}Description`])
      : intl.formatMessage(intlMessages.notAvailable);
    return (
      <Styled.CatalogRow
        key={id}
        type="button"
        aria-disabled={!isAvailable}
        data-test={`${id}PluginRow`}
        onClick={() => openCatalogEntry(id)}
      >
        <Styled.RowIcon aria-hidden="true" $appKey={id}>
          <Icon iconName={icon} />
        </Styled.RowIcon>
        <Styled.RowText>
          <Styled.RowLabel>{name}</Styled.RowLabel>
          <Styled.RowDescription>{description}</Styled.RowDescription>
        </Styled.RowText>
        <Styled.Chevron aria-hidden="true"><Icon iconName="right_arrow" /></Styled.Chevron>
      </Styled.CatalogRow>
    );
  };

  const appKeys = Object.keys(registeredApps);
  const query = searchQuery.trim().toLowerCase();
  const matches = (appKey: string) => (
    !query || registeredApps[appKey].name.toLowerCase().includes(query)
  );
  const featured = FEATURED_APPS.filter((appKey) => appKey in registeredApps && matches(appKey));
  const catalog = CATALOG.filter(({ id }) => !query
    || intl.formatMessage(intlMessages[id]).toLowerCase().includes(query));
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
        name={isTile ? featuredLabels[appKey] ?? name : name}
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
          {(more.length > 0 || catalog.length > 0) && (
            <>
              <Styled.Heading>{intl.formatMessage(intlMessages.more)}</Styled.Heading>
              <Styled.List>
                {catalog.map(renderCatalogEntry)}
                {more.map((appKey) => renderItem(appKey, false))}
              </Styled.List>
            </>
          )}
          {!featured.length && !more.length && !catalog.length && (
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
