import React, { useRef, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import Styled from './styles';
import { parseTime } from './service';

const intlMessages = defineMessages({
  edit: {
    id: 'app.timer.card.editTime',
    description: 'Label for the button that edits the time of the timer',
    defaultMessage: 'Edit time, {time}',
  },
  input: {
    id: 'app.timer.card.timeInput',
    description: 'Label for the field where the time of the timer is typed',
    defaultMessage: 'Time in minutes, or minutes:seconds',
  },
});

interface EditableClockProps {
  clock: string;
  low: boolean;
  small: boolean;
  maxSeconds: number;
  onChange: (seconds: number) => void;
}

const EditableClock: React.FC<EditableClockProps> = ({
  clock, low, small, maxSeconds, onChange,
}) => {
  const intl = useIntl();
  const [draft, setDraft] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const finish = (save: boolean, refocus: boolean) => {
    if (draft === null) return;
    const seconds = parseTime(draft, maxSeconds);
    if (save && seconds !== null && draft !== clock) onChange(seconds);
    setDraft(null);
    if (refocus) setTimeout(() => buttonRef.current?.focus(), 0);
  };

  if (draft === null) {
    return (
      <Styled.ClockButton
        ref={buttonRef}
        type="button"
        dir="ltr"
        $low={low}
        $small={small}
        aria-label={intl.formatMessage(intlMessages.edit, { time: clock })}
        data-test="editFloatingTimer"
        onClick={() => setDraft(clock)}
      >
        {clock}
      </Styled.ClockButton>
    );
  }

  return (
    <Styled.ClockInput
      type="text"
      dir="ltr"
      $small={small}
      value={draft}
      maxLength={8}
      // The field replaces the button that was just pressed
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
      aria-label={intl.formatMessage(intlMessages.input)}
      aria-invalid={parseTime(draft, maxSeconds) === null}
      data-test="floatingTimerInput"
      onFocus={(event) => event.target.select()}
      onChange={(event) => setDraft(event.target.value.replace(/[^\d:]/g, ''))}
      onBlur={() => finish(true, false)}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key === 'Enter') finish(true, true);
        if (event.key === 'Escape') finish(false, true);
      }}
    />
  );
};

export default EditableClock;
