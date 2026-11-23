import {
  colorPrimary,
  timerDone,
  timerEnding,
  timerLow,
} from '/imports/ui/stylesheets/styled-components/palette';

const LOW_SECONDS = 10;
const ENDING_SECONDS = 60;

interface TimerState {
  /** Time left, or time elapsed for a stopwatch, in milliseconds */
  timePassed: number;
  /** Duration of the timer in milliseconds */
  time: number;
  stopwatch: boolean;
}

export const isTimerLow = ({ timePassed, stopwatch }: TimerState) => (
  !stopwatch && Math.floor(timePassed / 1000) > 0 && timePassed <= LOW_SECONDS * 1000
);

export const getRingProgress = ({ timePassed, time, stopwatch }: TimerState) => {
  if (stopwatch) return (timePassed % 60000) / 60000;
  if (Math.floor(timePassed / 1000) <= 0) return 1;
  return time > 0 ? timePassed / time : 0;
};

export const getRingColor = (state: TimerState) => {
  const { timePassed, stopwatch } = state;
  if (stopwatch) return colorPrimary;
  if (Math.floor(timePassed / 1000) <= 0) return timerDone;
  if (isTimerLow(state)) return timerLow;
  if (timePassed <= ENDING_SECONDS * 1000) return timerEnding;
  return colorPrimary;
};
