import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useMutation } from '@apollo/client';
import Styled from './styles';
import useFloatingPosition, { Bounds, Position } from './useFloatingPosition';
import EditableClock from './editable-clock';
import TimerRing from '../ring/component';
import {
  getRingColor,
  getRingProgress,
  isTimerLow,
} from '../ring/service';
import {
  TIMER_DEACTIVATE,
  TIMER_RESET,
  TIMER_SET_SONG_TRACK,
  TIMER_SET_TIME,
  TIMER_START,
  TIMER_STOP,
  TIMER_SWITCH_MODE,
} from '../mutations';
import humanizeSeconds from '/imports/utils/humanizeSeconds';
import useTimerCard, { setTimerCard } from '/imports/ui/core/local-states/useTimerCard';
import useTimer from '/imports/ui/core/hooks/useTimer';
import useCurrentUser from '/imports/ui/core/hooks/useCurrentUser';
import usePreviousValue from '/imports/ui/hooks/usePreviousValue';
import useSettings from '/imports/ui/services/settings/hooks/useSettings';
import { SETTINGS } from '/imports/ui/services/settings/enums';
import { layoutSelectOutput } from '../../layout/context';
import { Output } from '../../layout/layoutTypes';
import useIsNavigationDocked from '../../sidebar-navigation/hooks/useIsNavigationDocked';
import logger from '/imports/startup/client/logger';
import { timerDone } from '/imports/ui/stylesheets/styled-components/palette';

const MINUTE = 60000;
const HOUR = 3600000;
const PRESET_COUNT = 4;
const CONFETTI_PIECES = 14;
const TRACKS = ['noTrack', 'track1', 'track2', 'track3'] as const;

const intlMessages = defineMessages({
  timer: { id: 'app.timer.timer.title' },
  stopwatch: { id: 'app.timer.stopwatch.title' },
  start: { id: 'app.timer.button.start' },
  stop: { id: 'app.timer.button.stop' },
  reset: { id: 'app.timer.button.reset' },
  deactivate: { id: 'app.timer.button.deactivate' },
  mode: {
    id: 'app.timer.card.mode',
    description: 'Label for the switch between timer and stopwatch',
    defaultMessage: 'Timer or stopwatch',
  },
  music: { id: 'app.timer.songs' },
  noTrack: { id: 'app.timer.noTrack' },
  track1: { id: 'app.timer.track1' },
  track2: { id: 'app.timer.track2' },
  track3: { id: 'app.timer.track3' },
  running: {
    id: 'app.timer.status.running',
    description: 'Shown while the timer is running',
    defaultMessage: 'Running',
  },
  paused: {
    id: 'app.timer.status.paused',
    description: 'Shown while the timer is paused',
    defaultMessage: 'Paused',
  },
  done: {
    id: 'app.timer.status.done',
    description: 'Shown when the timer reaches zero',
    defaultMessage: 'Time is up',
  },
  ready: {
    id: 'app.timer.status.ready',
    description: 'Shown before the timer starts',
    defaultMessage: 'Ready',
  },
  low: {
    id: 'app.timer.status.low',
    description: 'Shown in the last seconds of the timer',
    defaultMessage: 'Almost there',
  },
  everyone: {
    id: 'app.timer.card.everyone',
    description: 'Reminds moderators that the timer card is shared',
    defaultMessage: 'everyone sees it',
  },
  move: {
    id: 'app.timer.card.move',
    description: 'Label for the handle that moves the timer card',
    defaultMessage: 'Move timer with the arrow keys',
  },
  minimize: {
    id: 'app.timer.card.minimize',
    description: 'Label for the button that minimizes the timer card',
    defaultMessage: 'Minimize timer',
  },
  expand: {
    id: 'app.timer.card.expand',
    description: 'Label for the minimized timer',
    defaultMessage: 'Expand timer, {time}',
  },
  presets: {
    id: 'app.timer.card.presets',
    description: 'Label for the group of quick times',
    defaultMessage: 'Quick times',
  },
  setTimerTo: { id: 'app.timer.aria.setTo' },
  addMinute: {
    id: 'app.timer.card.addMinute',
    description: 'Button that adds one minute to the timer',
    defaultMessage: '+1 min',
  },
  addMinuteLabel: {
    id: 'app.timer.card.addMinuteLabel',
    description: 'Accessible label for the button that adds one minute, starts with its visible text',
    defaultMessage: '+1 min, add one minute',
  },
});

const GRIP_DOTS = [6, 12, 18].flatMap((y) => [9, 15].map((x) => ({ x, y })));

interface FloatingTimerProps {
  time: number;
  timePassed: number;
  stopwatch: boolean;
  songTrack: string;
  running: boolean;
  isPaused: boolean;
  isDone: boolean;
  isModerator: boolean;
  animations: boolean;
  bounds: Bounds;
  position: Position;
  setPosition: (position: Position) => void;
  minimized: boolean;
  setMinimized: (minimized: boolean) => void;
  shouldFocus: boolean;
  clearDone: () => void;
}

const FloatingTimer: React.FC<FloatingTimerProps> = ({
  time,
  timePassed,
  stopwatch,
  songTrack,
  running,
  isPaused,
  isDone,
  isModerator,
  animations,
  bounds,
  position,
  setPosition,
  minimized,
  setMinimized,
  shouldFocus,
  clearDone,
}) => {
  const intl = useIntl();
  const [timerStart] = useMutation(TIMER_START);
  const [timerStop] = useMutation(TIMER_STOP);
  const [timerReset] = useMutation(TIMER_RESET);
  const [timerSetTime] = useMutation(TIMER_SET_TIME);
  const [timerSwitchMode] = useMutation(TIMER_SWITCH_MODE);
  const [timerSetSongTrack] = useMutation(TIMER_SET_SONG_TRACK);
  const [timerDeactivate] = useMutation(TIMER_DEACTIVATE);
  const {
    ref, left, top, dragging, wasDragged, onKeyDown, onPointerDown,
  } = useFloatingPosition(bounds, position, setPosition);

  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const playRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!shouldFocus || !playRef.current) return;
    playRef.current.focus();
    setTimerCard((state) => ({ ...state, shouldFocus: false }));
  }, [shouldFocus]);

  const { presets, maxHours, music } = window.meetingClientSettings.public.timer;

  const maxSeconds = (maxHours * HOUR) / 1000 + 59 * 60 + 59;

  // The server goes back to the full time as soon as the timer ends
  const shownTime = isDone ? 0 : timePassed;
  const state = { timePassed: shownTime, time, stopwatch };
  const isLow = running && isTimerLow(state);
  const color = isDone ? timerDone : getRingColor(state);
  const progress = getRingProgress(state);
  const clock = humanizeSeconds(Math.floor(shownTime / 1000));
  const title = intl.formatMessage(stopwatch ? intlMessages.stopwatch : intlMessages.timer);

  let status = intlMessages.ready;
  if (isDone) status = intlMessages.done;
  else if (isLow) status = intlMessages.low;
  else if (running) status = intlMessages.running;
  else if (isPaused) status = intlMessages.paused;

  // Each step waits for the one before it, also across clicks: pressing Start
  // while typing a time first saves the time
  const runInOrder = (steps: Array<() => Promise<unknown>>) => {
    queue.current = steps
      .reduce((previous, step) => previous.then(step), queue.current)
      .catch((error) => {
        logger.error({
          logCode: 'timer_card_action_failed',
          extraInfo: { errorMessage: error?.message },
        }, 'Timer card action failed');
      });
    return queue.current;
  };

  const toggle = () => runInOrder([running ? () => timerStop() : () => timerStart()]);

  const reset = () => {
    clearDone();
    return runInOrder([() => timerStop(), () => timerReset()]);
  };

  const setTime = (seconds: number) => {
    clearDone();
    return runInOrder([
      () => timerStop(),
      () => timerReset(),
      () => timerSetTime({ variables: { time: seconds * 1000 } }),
    ]);
  };

  const switchMode = (toStopwatch: boolean) => {
    if (toStopwatch === stopwatch) return undefined;
    clearDone();
    return runInOrder([
      () => timerStop(),
      () => timerReset(),
      () => timerSwitchMode({ variables: { stopwatch: toStopwatch } }),
    ]);
  };

  const addMinute = () => {
    if (isDone) {
      return runInOrder([
        () => timerSetTime({ variables: { time: MINUTE } }),
        () => timerStart(),
      ]);
    }
    const newTime = Math.min(time + MINUTE, maxSeconds * 1000);
    return runInOrder([() => timerSetTime({ variables: { time: newTime } })]);
  };

  const confetti = useMemo(() => Array.from({ length: CONFETTI_PIECES }, (_, index) => ({
    id: `confetti-${index}`,
    index,
  })), []);

  const formatPreset = (seconds: number) => intl.formatNumber(
    seconds < 60 ? seconds : seconds / 60,
    {
      style: 'unit',
      unitDisplay: 'narrow',
      unit: seconds < 60 ? 'second' : 'minute',
      maximumFractionDigits: 1,
    },
  );

  const surface = {
    ref,
    style: { left, top },
    $dragging: dragging,
    $low: isLow,
    $done: isDone,
    $animated: animations,
    onPointerDown,
  };

  if (minimized) {
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Styled.Pill {...surface} data-test="floatingTimerMinimized">
        <Styled.PillButton
          type="button"
          data-drag-handle
          aria-label={intl.formatMessage(intlMessages.expand, { time: clock })}
          onKeyDown={onKeyDown}
          onClick={(event) => {
            // A drag also ends in a click; a click from the keyboard has no detail
            if (wasDragged.current && event.detail > 0) return;
            setMinimized(false);
          }}
        >
          <TimerRing size={28} stroke={5} color={color} progress={progress} />
          <Styled.PillTime dir="ltr" $low={isLow}>{clock}</Styled.PillTime>
        </Styled.PillButton>
      </Styled.Pill>
    );
  }

  return (
    <Styled.Card
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...surface}
      role="group"
      aria-label={title}
      data-test="floatingTimer"
    >
      <Styled.Header>
        <Styled.Grip
          type="button"
          data-drag-handle
          aria-label={intl.formatMessage(intlMessages.move)}
          onKeyDown={onKeyDown}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {GRIP_DOTS.map(({ x, y }) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" />)}
          </svg>
        </Styled.Grip>
        <Styled.Title>
          {title}
          {isModerator && (
            <Styled.Hint>
              {' · '}
              {intl.formatMessage(intlMessages.everyone)}
            </Styled.Hint>
          )}
        </Styled.Title>
        <Styled.HeaderButton
          type="button"
          aria-label={intl.formatMessage(intlMessages.minimize)}
          data-test="minimizeFloatingTimer"
          onClick={() => setMinimized(true)}
        >
          <Styled.Icon viewBox="0 0 24 24" $size={12} aria-hidden="true"><path d="M5 12h14" /></Styled.Icon>
        </Styled.HeaderButton>
        {isModerator && (
          <Styled.HeaderButton
            type="button"
            aria-label={intl.formatMessage(intlMessages.deactivate)}
            data-test="closeFloatingTimer"
            onClick={() => runInOrder([() => timerDeactivate()])}
          >
            <Styled.Icon viewBox="0 0 24 24" $size={12} aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></Styled.Icon>
          </Styled.HeaderButton>
        )}
      </Styled.Header>

      {isModerator && (
        <Styled.ModeSwitch role="group" aria-label={intl.formatMessage(intlMessages.mode)}>
          {[false, true].map((isStopwatch) => (
            <Styled.ModeButton
              key={isStopwatch ? 'stopwatch' : 'timer'}
              type="button"
              $selected={stopwatch === isStopwatch}
              aria-pressed={stopwatch === isStopwatch}
              disabled={running}
              data-test={isStopwatch ? 'stopwatchButton' : 'timerButton'}
              onClick={() => switchMode(isStopwatch)}
            >
              {intl.formatMessage(isStopwatch ? intlMessages.stopwatch : intlMessages.timer)}
            </Styled.ModeButton>
          ))}
        </Styled.ModeSwitch>
      )}

      <Styled.RingWrapper $pulse={isLow && animations}>
        <TimerRing size={168} stroke={12} color={color} progress={progress} />
        <Styled.RingContent>
          {isModerator && !running && !stopwatch ? (
            <EditableClock
              clock={clock}
              low={isLow}
              small={clock.length > 5}
              maxSeconds={maxSeconds}
              onChange={setTime}
            />
          ) : (
            <Styled.Clock
              role="timer"
              aria-live="off"
              dir="ltr"
              $low={isLow}
              $small={clock.length > 5}
            >
              {clock}
            </Styled.Clock>
          )}
          <Styled.Status role="status">{intl.formatMessage(status)}</Styled.Status>
        </Styled.RingContent>
      </Styled.RingWrapper>

      {isDone && animations && (
        <Styled.Confetti aria-hidden="true">
          {confetti.map(({ id, index }) => <Styled.ConfettiPiece key={id} $index={index} />)}
        </Styled.Confetti>
      )}

      {isModerator && !stopwatch && (
        <Styled.Presets role="group" aria-label={intl.formatMessage(intlMessages.presets)}>
          {presets.slice(0, PRESET_COUNT).map((seconds: number) => {
            const label = formatPreset(seconds);
            const selected = time === seconds * 1000;
            return (
              <Styled.Preset
                key={seconds}
                type="button"
                $selected={selected}
                aria-pressed={selected}
                aria-label={intl.formatMessage(intlMessages.setTimerTo, { label })}
                onClick={() => setTime(seconds)}
              >
                {label}
              </Styled.Preset>
            );
          })}
        </Styled.Presets>
      )}

      {isModerator && (
        <Styled.Controls>
          <Styled.RoundButton
            type="button"
            aria-label={intl.formatMessage(intlMessages.reset)}
            data-test="resetFloatingTimer"
            onClick={reset}
          >
            <Styled.Icon viewBox="0 0 24 24" $size={17} aria-hidden="true">
              <path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4" />
            </Styled.Icon>
          </Styled.RoundButton>
          <Styled.PlayButton
            ref={playRef}
            type="button"
            $running={running}
            aria-label={intl.formatMessage(running ? intlMessages.stop : intlMessages.start)}
            data-test="toggleFloatingTimer"
            onClick={toggle}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={running ? 'M7 5h3.5v14H7zM13.5 5H17v14h-3.5z' : 'M8 5l11 7-11 7z'} />
            </svg>
          </Styled.PlayButton>
          {!stopwatch && (
            <Styled.AddButton
              type="button"
              aria-label={intl.formatMessage(intlMessages.addMinuteLabel)}
              data-test="addMinuteFloatingTimer"
              onClick={addMinute}
            >
              <bdi>{intl.formatMessage(intlMessages.addMinute)}</bdi>
            </Styled.AddButton>
          )}
        </Styled.Controls>
      )}

      {isModerator && !stopwatch && music.enabled && (
        <Styled.MusicLabel>
          {intl.formatMessage(intlMessages.music)}
          <Styled.MusicSelect
            value={songTrack}
            disabled={running}
            data-test="floatingTimerMusic"
            onChange={(event) => {
              const track = event.target.value;
              runInOrder([() => timerSetSongTrack({ variables: { track } })]);
            }}
          >
            {TRACKS.map((track) => (
              <option key={track} value={track}>{intl.formatMessage(intlMessages[track])}</option>
            ))}
          </Styled.MusicSelect>
        </Styled.MusicLabel>
      )}
    </Styled.Card>
  );
};

const FloatingTimerContainer: React.FC = () => {
  const { data: timer } = useTimer();
  const { data: currentUser } = useCurrentUser((u) => ({ isModerator: u.isModerator }));
  const { animations } = useSettings(SETTINGS.APPLICATION) as { animations: boolean };
  const isNavigationDocked = useIsNavigationDocked();
  const navBar = layoutSelectOutput((i: Output) => i.navBar);
  const actionBar = layoutSelectOutput((i: Output) => i.actionBar);

  const [position, setPosition] = useState<Position>(() => ({
    x: document.documentElement.dir === 'rtl' ? 0 : 1,
    y: 0,
  }));
  const [{ minimized, shouldFocus }] = useTimerCard();
  const [isDone, setIsDone] = useState(false);

  const active = !!timer?.active;
  const elapsed = !!timer?.elapsed;
  const running = !!timer?.running;
  const time = timer?.time;
  const previousElapsed = usePreviousValue<boolean>(elapsed);

  // Like the alarm, only for people who were here when the time ran out
  useEffect(() => {
    if (elapsed && previousElapsed === false && timer) setIsDone(true);
  }, [elapsed]);

  useEffect(() => {
    if (running) setIsDone(false);
  }, [running]);

  useEffect(() => {
    setIsDone(false);
  }, [time, active, timer?.stopwatch]);

  if (!timer || !active || !isNavigationDocked || !navBar || !actionBar) return null;

  const top = navBar.top + navBar.height;
  const bounds = {
    left: navBar.left ?? 0,
    top,
    width: navBar.width,
    height: actionBar.top - top,
  };

  return (
    <FloatingTimer
      // The card and the pill are measured separately
      key={minimized ? 'minimized' : 'expanded'}
      time={timer.time}
      timePassed={timer.timePassed}
      stopwatch={timer.stopwatch}
      songTrack={timer.songTrack}
      running={running}
      isPaused={!running && timer.startedAt !== null}
      isDone={isDone && !running}
      isModerator={!!currentUser?.isModerator}
      animations={animations}
      bounds={bounds}
      position={position}
      setPosition={setPosition}
      minimized={minimized}
      setMinimized={(value) => setTimerCard((state) => ({ ...state, minimized: value }))}
      shouldFocus={shouldFocus}
      clearDone={() => setIsDone(false)}
    />
  );
};

export default FloatingTimerContainer;
