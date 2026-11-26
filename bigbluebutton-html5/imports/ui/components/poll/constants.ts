import { PANELS } from '/imports/ui/components/layout/enums';

export const POLLS_APP_KEY = PANELS.POLL;
export const POLLS_ICON = 'polling';
export const POLLS_LABEL = {
  id: 'app.poll.pollPaneTitle',
  description: 'label for user-list poll button',
};

export default {
  POLLS_APP_KEY,
  POLLS_ICON,
  POLLS_LABEL,
};

/** Set before opening Polling to start on the Quiz tab; read once */
export const POLL_START_AS_QUIZ = 'pollStartAsQuiz';
