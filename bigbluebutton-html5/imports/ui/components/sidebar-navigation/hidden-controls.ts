// Controls hidden for now while the navigation is docked (desktop and tablet).
// Set one to false to show it again.
const HIDDEN_CONTROLS = {
  /** Mute all, and Permissions and Policies, at the bottom of People */
  crowdActions: true,
  /** Minimize presentation in the bottom bar. Restore still shows once it is minimized. */
  minimizePresentation: true,
  /** Profile in the bottom bar */
  profile: true,
  /** The button that opens a second column beside the side panel */
  secondColumn: true,
  /**
   * Options (three dots) in the top bar: settings, fullscreen, keyboard
   * shortcuts, move panel, plugin items. Only hidden while the bottom bar has
   * its own leave button, so there is always a way out of the meeting.
   */
  optionsMenu: true,
};

export default HIDDEN_CONTROLS;
