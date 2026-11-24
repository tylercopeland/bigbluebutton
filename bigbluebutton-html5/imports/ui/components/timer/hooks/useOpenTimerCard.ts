import { useCallback } from 'react';
import { setTimerCard } from '/imports/ui/core/local-states/useTimerCard';
import useActivateTimer from './useActivateTimer';

// Shows the floating card without touching the panel that is open
const useOpenTimerCard = () => {
  const activateTimer = useActivateTimer();

  return useCallback(() => {
    activateTimer();
    setTimerCard({ minimized: false, shouldFocus: true });
  }, [activateTimer]);
};

export default useOpenTimerCard;
