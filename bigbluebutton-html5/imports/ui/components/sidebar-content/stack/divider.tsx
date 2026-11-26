import React, { useRef } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import KEYS from '/imports/utils/keys';
import Styled from './styles';
import { MIN_STACKED_HEIGHT } from './usePanelStack';

const KEYBOARD_STEP = 0.05;

const intlMessages = defineMessages({
  label: {
    id: 'app.sidebarContent.stackDivider',
    description: 'Label for the divider that changes the height of the stacked panels',
    defaultMessage: 'Resize panels',
  },
});

interface StackDividerProps {
  ratio: number;
  onChange: (ratio: number) => void;
  onReset: () => void;
}

const StackDivider: React.FC<StackDividerProps> = ({ ratio, onChange, onReset }) => {
  const intl = useIntl();
  const ref = useRef<HTMLDivElement>(null);

  const update = (newRatio: number) => {
    const height = ref.current?.parentElement?.clientHeight ?? 0;
    if (!height) return;
    const min = Math.min(0.5, MIN_STACKED_HEIGHT / height);
    onChange(Math.min(1 - min, Math.max(min, newRatio)));
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const panel = event.currentTarget.parentElement?.getBoundingClientRect();
    if (panel?.height) update((event.clientY - panel.top) / panel.height);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === KEYS.ARROW_UP) update(ratio - KEYBOARD_STEP);
    else if (event.key === KEYS.ARROW_DOWN) update(ratio + KEYBOARD_STEP);
    else if (event.key === KEYS.ENTER) onReset();
    else return;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Styled.Divider
      ref={ref}
      role="separator"
      aria-orientation="horizontal"
      aria-label={intl.formatMessage(intlMessages.label)}
      aria-valuenow={Math.round(ratio * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      data-test="panelStackDivider"
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={onPointerMove}
      onDoubleClick={onReset}
      onKeyDown={onKeyDown}
    />
  );
};

export default StackDivider;
