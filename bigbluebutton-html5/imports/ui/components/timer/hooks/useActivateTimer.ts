import { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { TIMER_ACTIVATE } from '../mutations';
import useTimer from '/imports/ui/core/hooks/useTimer';
import useCurrentUser from '/imports/ui/core/hooks/useCurrentUser';
import Auth from '/imports/ui/services/auth';
import logger from '/imports/startup/client/logger';

const MILLI_IN_MINUTE = 60000;

const useActivateTimer = () => {
  const [timerActivate] = useMutation(TIMER_ACTIVATE);
  const { data: timerData } = useTimer();
  const { data: currentUser } = useCurrentUser((u) => ({ isModerator: u.isModerator }));
  const isActive = timerData?.active;
  const amIModerator = !!currentUser?.isModerator;

  return useCallback(() => {
    if (isActive || !amIModerator) return;

    const TIMER_CONFIG = window.meetingClientSettings.public.timer;
    const meetingId = Auth.meetingID;
    if (!meetingId) {
      logger.warn({ logCode: 'timer_activate_no_meetingid' }, 'Timer activation skipped: no meetingId');
      return;
    }

    timerActivate({
      variables: {
        stopwatch: false,
        running: false,
        time: TIMER_CONFIG.time * MILLI_IN_MINUTE,
        meetingId,
      },
    }).catch((error) => {
      if (!error.message?.includes('already active')) {
        logger.error(
          { logCode: 'timer_activate_failed', extraInfo: { errorMessage: error?.message } },
          `Timer activation failed: ${error?.message}`,
        );
      }
    });
  }, [timerActivate, isActive, amIModerator]);
};

export default useActivateTimer;
