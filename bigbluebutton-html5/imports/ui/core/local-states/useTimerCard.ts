import createUseLocalState from './createUseLocalState';

interface TimerCardState {
  minimized: boolean;
  /** Set when the person opens the timer, so the card takes the focus once */
  shouldFocus: boolean;
}

const [useTimerCard, setTimerCard] = createUseLocalState<TimerCardState>({
  minimized: false,
  shouldFocus: false,
});

export default useTimerCard;
export { setTimerCard };
