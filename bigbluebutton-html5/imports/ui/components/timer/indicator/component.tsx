import { useMutation } from '@apollo/client';
import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import Styled from './styles';
import TimerRing from '../ring/component';
import { getRingColor, getRingProgress, isTimerLow } from '../ring/service';
import humanizeSeconds from '/imports/utils/humanizeSeconds';
import useCurrentUser from '/imports/ui/core/hooks/useCurrentUser';
import { layoutSelectInput } from '../../layout/context';
import { Input } from '../../layout/layoutTypes';
import { TIMER_START, TIMER_STOP } from '../mutations';
import useTimer from '/imports/ui/core/hooks/useTimer';
import useIsNavigationDocked from '../../sidebar-navigation/hooks/useIsNavigationDocked';
import usePreviousValue from '/imports/ui/hooks/usePreviousValue';

interface TimerIndicatorProps {
  timePassed: number;
  time: number;
  stopwatch: boolean;
  songTrack: string;
  elapsed?: boolean;
  running: boolean;
  isModerator: boolean;
  sidebarNavigationIsOpen: boolean;
  sidebarContentIsOpen: boolean;
  hasFloatingCard: boolean;
}

const TimerIndicator: React.FC<TimerIndicatorProps> = ({
  timePassed,
  time,
  stopwatch,
  songTrack,
  elapsed,
  running,
  isModerator,
  sidebarNavigationIsOpen,
  sidebarContentIsOpen,
  hasFloatingCard,
}) => {
  const timeRef = useRef<HTMLSpanElement>(null);
  const alarm = useRef<HTMLAudioElement>();
  const music = useRef<HTMLAudioElement>();
  const triggered = useRef<boolean>(true);
  const alreadyNotified = useRef<boolean>(false);
  const [startTimerMutation] = useMutation(TIMER_START);
  const [stopTimerMutation] = useMutation(TIMER_STOP);
  const [songTrackState, setSongTrackState] = useState<string>(songTrack);
  const prevElapsed = usePreviousValue<boolean | undefined>(elapsed);

  const CDN = window.meetingClientSettings.public.app.cdn;
  const BASENAME = window.meetingClientSettings.public.app.basename;
  const HOST = CDN + BASENAME;
  const trackName = window.meetingClientSettings.public.timer.music;
  const MUSIC_VOLUME = window.meetingClientSettings.public.timer.music.volume;

  type ObjectKey = keyof typeof trackName;

  const startTimer = () => {
    startTimerMutation();
  };

  const stopTimer = () => {
    stopTimerMutation();
  };

  useEffect(() => {
    if (songTrackState !== songTrack) {
      if (music.current) music.current.pause();
    }
    if (songTrack in trackName) {
      music.current = new Audio(`${HOST}/resources/sounds/${trackName[songTrack as ObjectKey]}.mp3`);
      music.current.volume = MUSIC_VOLUME;
      setSongTrackState(songTrack);
      music.current.addEventListener('timeupdate', () => {
        const buffer = 0.19;
        // Start playing the music before it ends to make the loop gapless
        if (!music.current) return null;
        if (music.current.currentTime > music.current.duration - buffer) {
          music.current.currentTime = 0;
          music.current.play();
        }
        return null;
      });
    }

    return () => {
      if (music.current) music.current.pause();
    };
  }, [songTrack]);

  useEffect(() => {
    alarm.current = new Audio(`${HOST}/resources/sounds/alarm.mp3`);
  }, []);

  useEffect(() => {
    // Prevent the alarm from triggering for users that join the conference
    // after the timer has elapsed. It only triggers for users that see the
    // elapsed property of timer change from false to true
    if (elapsed && prevElapsed === false) {
      if (!alreadyNotified.current) {
        triggered.current = false;
        alreadyNotified.current = true;
        if (alarm.current) alarm.current.play();
      }
    }
  }, [elapsed]);

  useEffect(() => {
    if (!timeRef.current) {
      if (music.current) music.current.pause();
      if (alarm.current) alarm.current.pause();
    }
  }, [timePassed]);

  useEffect(() => {
    if (running && songTrack !== 'noTrack') {
      if (music.current) music.current.play();
    } else if (!running || songTrack === 'noTrack') {
      if (music.current) music.current.pause();
    }
    if (running && alreadyNotified.current) {
      alreadyNotified.current = false;
    }
  }, [running, songTrackState]);

  const timerState = { timePassed, time, stopwatch };
  const isLow = isTimerLow(timerState);

  const onClick = running ? stopTimer : startTimer;

  return (
    // Stays mounted without showing, it plays the music and the alarm
    <Styled.TimerWrapper
      $hidden={hasFloatingCard}
      className={cx('bbb-timer-indicator', { 'bbb-timer-indicator--running': running })}
    >
      <Styled.Timer>
        <Styled.TimerButton
          $running={running}
          $low={isLow}
          disabled={!isModerator}
          hide={sidebarNavigationIsOpen && sidebarContentIsOpen && !running}
          role="button"
          tabIndex={0}
          onClick={isModerator ? onClick : () => {}}
          data-test="timeIndicator"
        >
          <Styled.TimerContent>
            <TimerRing
              size={22}
              stroke={4}
              color={getRingColor(timerState)}
              progress={getRingProgress(timerState)}
            />
            <Styled.TimerTime
              dir="ltr"
              aria-hidden
              ref={timeRef}
            >
              {humanizeSeconds(Math.floor(timePassed / 1000))}
            </Styled.TimerTime>
          </Styled.TimerContent>
        </Styled.TimerButton>
      </Styled.Timer>
    </Styled.TimerWrapper>
  );
};

const TimerIndicatorContainer: React.FC = () => {
  const { data: currentUser } = useCurrentUser((u) => ({
    isModerator: u.isModerator,
  }));

  const {
    data: timerData,
  } = useTimer(true);

  const sidebarNavigation = layoutSelectInput((i: Input) => i.sidebarNavigation);
  const hasFloatingCard = useIsNavigationDocked();
  const sidebarContent = layoutSelectInput((i: Input) => i.sidebarContent);
  const sidebarNavigationIsOpen = sidebarNavigation.isOpen;
  const sidebarContentIsOpen = sidebarContent.isOpen;

  const currentTimer = timerData;
  if (!currentTimer?.active) return null;
  const {
    timePassed = 0,
    time,
    stopwatch,
    songTrack,
    elapsed,
    running,
  } = currentTimer;

  return (
    <TimerIndicator
      timePassed={timePassed}
      time={time}
      stopwatch={stopwatch}
      songTrack={songTrack}
      elapsed={elapsed}
      running={running}
      isModerator={currentUser?.isModerator ?? false}
      sidebarNavigationIsOpen={sidebarNavigationIsOpen}
      sidebarContentIsOpen={sidebarContentIsOpen}
      hasFloatingCard={hasFloatingCard}
    />
  );
};

export default TimerIndicatorContainer;
