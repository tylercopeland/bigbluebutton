import React, { useEffect, useRef } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import KEYS from '/imports/utils/keys';
import Styled from './styles';

const intlMessages = defineMessages({
  label: {
    id: 'app.mediaSharing.tabs.label',
    description: 'Label of the list of media types that can be shared',
    defaultMessage: 'Media type',
  },
});

export interface MediaTab {
  id: string;
  label: string;
  icon: React.ReactElement;
  dataTest: string;
  content: React.ReactNode;
}

interface MediaTabsProps {
  tabs: MediaTab[];
  selectedId: string;
  isRTL: boolean;
  onSelect: (id: string) => void;
  children?: React.ReactNode;
}

const MediaTabs: React.FC<MediaTabsProps> = ({
  tabs, selectedId, isRTL, onSelect, children = null,
}) => {
  const intl = useIntl();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const selected = tabs.find(({ id }) => id === selectedId) ?? tabs[0];

  useEffect(() => {
    tabRefs.current[selected?.id]?.focus();
  }, []);

  if (!selected) return <>{children}</>;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const index = tabs.indexOf(selected);
    const next = isRTL ? KEYS.ARROW_LEFT : KEYS.ARROW_RIGHT;
    const previous = isRTL ? KEYS.ARROW_RIGHT : KEYS.ARROW_LEFT;
    let target: MediaTab | undefined;
    if (event.key === next) target = tabs[(index + 1) % tabs.length];
    if (event.key === previous) target = tabs[(index + tabs.length - 1) % tabs.length];
    if (event.key === 'Home') [target] = tabs;
    if (event.key === 'End') target = tabs[tabs.length - 1];
    if (!target) return;
    event.preventDefault();
    onSelect(target.id);
    tabRefs.current[target.id]?.focus();
  };

  return (
    <>
      <Styled.Body
        key={selected.id}
        role="tabpanel"
        id="media-tab-panel"
        aria-labelledby={`media-tab-${selected.id}`}
      >
        {selected.content}
      </Styled.Body>
      {children}
      <Styled.Tabs role="tablist" aria-label={intl.formatMessage(intlMessages.label)}>
        {tabs.map(({
          id, label, icon, dataTest,
        }) => (
          <Styled.Tab
            key={id}
            ref={(element) => { tabRefs.current[id] = element; }}
            type="button"
            role="tab"
            id={`media-tab-${id}`}
            aria-selected={id === selected.id}
            aria-controls="media-tab-panel"
            tabIndex={id === selected.id ? 0 : -1}
            data-test={dataTest}
            $selected={id === selected.id}
            onClick={() => onSelect(id)}
            onKeyDown={handleKeyDown}
          >
            <Styled.TabTile>{icon}</Styled.TabTile>
            {label}
          </Styled.Tab>
        ))}
      </Styled.Tabs>
    </>
  );
};

export default MediaTabs;
