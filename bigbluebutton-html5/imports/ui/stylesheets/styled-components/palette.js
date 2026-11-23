const colorWhite = 'var(--color-white, #FFF)';
const colorOffWhite = 'var(--color-off-white, #F3F6F9)';
const colorTldrawBackground = 'var(--color-tldraw-background, #F9FAFB)';
const colorNeutral2 = 'var(--color-neutral-2, #717C91)';

const colorBlack = 'var(--color-black, #000000)';

const colorGray = 'var(--color-gray, #4E5A66)';
const colorGrayDark = 'var(--color-gray-dark, #06172A)';
const colorGrayLight = 'var(--color-gray-light, #8B9AA8)';
const colorGrayLighter = 'var(--color-gray-lighter, #A7B3BD)';
const colorGrayLightest = 'var(--color-gray-lightest, #D4D9DF)';
const colorGrayIcons = 'var(--color-gray-icons, #909CAF)';
const colorGrayUserListToolbar = 'var(--color-gray-user-list-toolbar, #F4F6FA)';

const colorBorder = 'var(--color-border, #B8C9D8)';

const colorBlueLight = 'var(--color-blue-light, #54a1f3)';
const colorBlueLighter = 'var(--color-blue-lighter, #92BCEA)';
const colorBlueLightest = 'var(--color-blue-lightest, #E4ECF2)';
const colorBlueAux = 'var(--color-blue-aux, #E5EFFB)';
const colorBlueDark = 'var(--color-blue-dark, #0F4D9D)';
const colorBlueLightestChannel = '228 236 242';
const colorBlueLighterChannel = '146 188 234';

const colorTransparent = 'var(--color-transparent, #ff000000)';

const colorUserModerator = 'var(--color-user-moderator, #7B209F)';
const colorUserYou = 'var(--color-user-you, #19237C)';
const colorUserViewer = 'var(--color-user-viewer, #2296C9)';

const colorPrimary = 'var(--color-primary, #1F62D0)';
const colorStandout = 'var(--color-standout, #A16207)';
const colorDanger = 'var(--color-danger, #DF2721)';
const colorDangerDark = 'var(--color-danger-dark, #AE1010)';
const colorSuccess = 'var(--color-success, #008081)';
const colorWarning = 'var(--color-warning, purple)';
const colorOffline = `var(--color-offline, ${colorGrayLight})`;
const colorMuted = 'var(--color-muted, #586571)';
const colorMutedBackground = 'var(--color-muted-background, #F3F6F9)';

const colorBackground = 'var(--color-background, #0B1220)';
const colorOverlay = 'var(--color-overlay, rgba(6, 23, 42, 0.75))';

const userListBg = `var(--user-list-bg, ${colorOffWhite})`;
const userListText = `var(--user-list-text, ${colorGray})`;
const unreadMessagesBg = `var(--unread-messages-bg, ${colorDanger})`;
const notificationBadgeBg = 'var(--notification-badge-bg, #FF3939)';
const colorGrayLabel = `var(--color-gray-label, ${colorGray})`;
const colorText = `var(--color-text, ${colorGray})`;
const colorLink = `var(--color-link, ${colorPrimary})`;

const listItemBgHover = `var(--list-item-bg-hover, ${colorBlueAux})`;
const colorTipBg = 'var(--color-tip-bg, #333333)';
const itemFocusBorder = `var(--item-focus-border, ${colorPrimary})`;

const btnDefaultColor = `var(--btn-default-color, ${colorGray})`;
const btnDefaultBg = `var(--btn-default-bg, ${colorWhite})`;
const btnDefaultBorder = `var(--btn-default-border, ${colorWhite})`;

const btnDefaultGhostColor = `var(--btn-default-color, ${colorWhite})`;
const btnDefaultGhostBg = 'var(--btn-default-bg, rgba(255, 255, 255, 0.1))'; // colorWhite, 10%
const btnDefaultGhostBorder = 'var(--btn-default-border, rgba(255, 255, 255, 0.5))'; // colorWhite, 50%
const btnDefaultGhostActiveBg = 'var(--btn-default-active-bg, rgba(255, 255, 255, 0.2))'; // colorWhite, 20%

// Recording indicator, active state only; the idle one keeps btnDefaultGhostBg.
// Both compose colorDanger, so retheming --color-danger reaches this state too.
// The fill is that red at 22%, so the outline below reads as the same colour.
const btnRecordingActiveBg = `var(--btn-recording-active-bg, color-mix(in srgb, ${colorDanger} 22%, transparent))`;
const btnRecordingActiveBorder = `var(--btn-recording-active-border, ${colorDanger})`;

const btnPrimaryBorder = 'var(--btn-primary-border, rgba(31, 98, 208, 0.5))'; // colorPrimary, 50%
const btnPrimaryColor = `var(--btn-primary-color, ${colorWhite})`;
const btnPrimaryBg = `var(--btn-primary-bg, ${colorPrimary})`;
const btnPrimaryHoverBg = 'var(--btn-primary-hover-bg, #1A54B3)';
const btnPrimaryActiveBg = 'var(--btn-primary-active-bg, #164796)';

const btnSuccessBorder = `var(--btn-success-border, ${colorSuccess})`;
const btnSuccessColor = `var(--btn-success-color, ${colorWhite})`;
const btnSuccessBg = `var(--btn-success-bg, ${colorSuccess})`;

const btnWarningBorder = `var(--btn-warning-border, ${colorWarning})`;
const btnWarningColor = `var(--btn-warning-color, ${colorWhite})`;
const btnWarningBg = `var(--btn-warning-bg, ${colorWarning})`;

const btnDangerBorder = `var(--btn-danger-border, ${colorDanger})`;
const btnDangerColor = `var(--btn-danger-color, ${colorWhite})`;
const btnDangerBg = `var(--btn-danger-bg, ${colorDanger})`;
const btnDangerBgHover = 'var(--btn-danger-bg-hover, #C61C1C)';

const btnDarkBorder = `var(--btn-dark-border, ${colorDanger})`;
const btnDarkColor = `var(--btn-dark-color, ${colorWhite})`;
const btnDarkBg = `var(--btn-dark-bg, ${colorGrayDark})`;

const btnOfflineBorder = `var(--btn-offline-border, ${colorOffline})`;
const btnOfflineColor = `var(--btn-offline-color, ${colorWhite})`;
const btnOfflineBg = `var(--btn-offline-bg, ${colorOffline})`;

const btnMutedBorder = `var(--btn-muted-border, ${colorMutedBackground})`;
const btnMutedColor = `var(--btn-muted-color, ${colorMuted})`;
const btnMutedBg = `var(--btn-muted-bg, ${colorMutedBackground})`;

const toolbarButtonColor = `var(--toolbar-button-color, ${btnDefaultColor})`;
const toolbarButtonColorDisabled = `var(--toolbar-button-color, ${colorGrayLight})`;
const userThumbnailBorder = `var(--user-thumbnail-border, ${colorBorder})`;
const loaderBg = `var(--loader-bg, ${colorGrayDark})`;
const loaderBullet = `var(--loader-bullet, ${colorWhite})`;

const systemMessageBackgroundColor = 'var(--system-message-background-color, #F9FBFC)';
const systemMessageBorderColor = `var(--system-message-border-color, ${colorBorder})`;
const systemMessageFontColor = `var(--system-message-font-color, ${colorGrayDark})`;
const highlightedMessageBackgroundColor = 'var(--system-message-background-color, #fef9f1)';
const highlightedMessageBorderColor = `var(--highlighted-message-border-color, ${colorBorder})`;
const emphasizedMessageBackgroundColor = 'var(--emphasized-message-background-color, #E9F1F9)';
const colorHeading = `var(--color-heading, ${colorGrayDark})`;
const palettePlaceholderText = 'var(--palette-placeholder-text, #787675)';
const pollAnnotationGray = 'var(--poll-annotation-gray, #333333)';

const appsGalleryOutlineColor = 'var(--apps-gallery-outline, #DCE4EC)';
const unpinnedAppIconColor = 'var(--apps-unpinned-icon-color, #A5B2C7)';
const appsPanelTextColor = 'var(--apps-panel-text-color, #393C48)';

const settingsModalTabSelected = 'var(--settings-modal-tab-selected, #eaf4fc)';

const toolbarButtonBorderColor = `var(--toolbar-button-border-color, ${colorGrayLighter})`;
const toolbarListColor = `var(--toolbar-list-color, ${colorGray})`;
const toolbarButtonBg = `var(--toolbar-button-bg, ${btnDefaultBg})`;
const toolbarListBg = 'var(--toolbar-list-bg, #DDD)';
const toolbarListBgFocus = 'var(--toolbar-list-bg-focus, #C6C6C6)';
const colorContentBackground = 'var(--color-content-background, #131F31)';

const dropdownBg = `var(--dropdown-bg, ${colorWhite})`;

const pollStatsBorderColor = `var(--poll-stats-border-color, ${colorBorder})`;
const pollBlue = `var(--poll-blue, ${colorPrimary})`;

const toastDefaultColor = `var(--toast-default-color, ${colorWhite})`;
const toastDefaultBg = `var(--toast-default-bg, ${colorGray})`;

const toastInfoColor = `var(--toast-info-color, ${colorWhite})`;
const toastInfoBg = `var(--toast-info-bg, ${colorPrimary})`;

const toastSuccessColor = `var(--toast-success-color, ${colorWhite})`;
const toastSuccessBg = `var(--toast-success-bg, ${colorSuccess})`;

const toastErrorColor = `var(--toast-error-color, ${colorWhite})`;
const toastErrorBg = `var(--toast-error-bg, ${colorDanger})`;

const webcamBackgroundColor = 'var(--webcam-background-color, #131F31)';
const webcamPlaceholderBorder = 'var(--webcam-placeholder-border, rgba(255, 255, 255, 0.5))'; // colorWhite, 50%

// rgba version of colorPrimary (0F70D7) with 15% opacity for talking indicator background
const webcamTalkingBackgroundColor = 'var(--webcam-talking-background-color, rgba(13, 109, 252, 0.15))';

const toastWarningColor = `var(--toast-warning-color, ${colorWhite})`;
const toastWarningBg = `var(--toast-warning-bg, ${colorWarning})`;
const defaultBorder = 'var(--default-border, #B0BDC9)';

// Meeting room chrome: controls that sit directly on colorBackground
const roomControlBg = 'var(--room-control-bg, #1C2738)';
const roomControlHoverBg = 'var(--room-control-hover-bg, #2A3850)';
const roomControlColor = 'var(--room-control-color, #E6EDF5)';
const roomControlActiveBg = 'var(--room-control-active-bg, #E6EEF9)';
const roomControlActiveColor = 'var(--room-control-active-color, #0F1B2B)';
const roomLive = 'var(--room-live, #3ECF8E)';
const roomMutedText = 'var(--room-muted-text, #A9B6C6)';
const roomRecording = 'var(--room-recording, #FF5A5F)';
const roomRecordingText = 'var(--room-recording-text, #FF8A8F)';
const roomLeaveBg = 'var(--room-leave-bg, #2A161B)';
const roomLeaveHoverBg = 'var(--room-leave-hover-bg, #421E26)';
const roomLeaveBorder = 'var(--room-leave-border, #6B2F36)';
const roomLeaveColor = 'var(--room-leave-color, #FF9EA1)';
const roomFocusRing = 'var(--room-focus-ring, #8AB4FF)';

// Side panel tabs
const panelTabsBg = 'var(--panel-tabs-bg, #EEF1F5)';
const panelTabColor = 'var(--panel-tab-color, #4B5563)';
const panelTabActiveColor = 'var(--panel-tab-active-color, #111827)';
const panelText = 'var(--panel-text, #111827)';
const panelMutedText = 'var(--panel-muted-text, #6B7280)';
const panelBorder = 'var(--panel-border, #CBD3DD)';
const panelRowHoverBg = 'var(--panel-row-hover-bg, #F4F6F9)';
const panelRowActionBg = 'var(--panel-row-action-bg, #E6EAF0)';
const panelRowActionHoverBg = 'var(--panel-row-action-hover-bg, #D6DCE5)';
const panelRowActionColor = 'var(--panel-row-action-color, #374151)';
const panelLive = 'var(--panel-live, #12A150)';
const panelLiveText = 'var(--panel-live-text, #0F7A3D)';
const pollBarColor = 'var(--poll-bar-color, #9DB7E2)';
const panelStatusColor = 'var(--panel-status-color, #7A8594)';
const panelStatusFaintColor = 'var(--panel-status-faint-color, #B3BCC8)';
const panelCameraColor = 'var(--panel-camera-color, #6B7280)';
const panelRaisedHandText = 'var(--panel-raised-hand-text, #9A5B00)';
const panelChipActiveBg = 'var(--panel-chip-active-bg, #1F2933)';
// Webcam tiles
const webcamTileBorder = 'var(--webcam-tile-border, #22324A)';
const webcamVideoBackground = 'var(--webcam-video-background, #2A3542)';
const webcamLabelBg = 'var(--webcam-label-bg, rgba(4, 12, 24, 0.75))';
const webcamRaisedHandBg = 'var(--webcam-raised-hand-bg, #F5A524)';
const webcamRaisedHandColor = 'var(--webcam-raised-hand-color, #1F1300)';
const webcamOverflowBorder = 'var(--webcam-overflow-border, #3A4D66)';

// Controls over the slide
const stageControlBorder = 'var(--stage-control-border, #E1E6EC)';
const stageControlColor = 'var(--stage-control-color, #374151)';
const stageControlActiveBg = 'var(--stage-control-active-bg, #E8F0FD)';

const chatBubbleBg = 'var(--chat-bubble-bg, #EEF1F5)';
const chatOwnBubbleBg = `var(--chat-own-bubble-bg, ${colorPrimary})`;
const panelRaisedHandBadge = 'var(--panel-raised-hand-badge, #A86A0F)';

// DARK THEME COLORS
const colorBackgroundDarkTheme = 'var(--color-background-dark-theme, #181A23)';
const colorOverlaysDarkTheme = 'var(--color-overlays-dark-theme, #2D2F38)';
const colorTextDarkTheme = `var(--color-text-dark-theme, ${colorWhite})`;
const colorPrimaryDarkTheme = `var(--color-primary-dark-theme, ${colorPrimary})`;

const SegmentedButtonRingOffsetShadow = 'var(--ring-offset-shadow, 0 0 #0000)';
const SegmentedButtonRingShadow = 'var(--ring-shadow, 0 0 #0000)';
const SegmentedButtonBoxShadowSm = 'var(--shadow, 0 1px 2px 0 rgba(0, 0, 0, 0.05))';
const slate900 = 'var(--slate-900, #111827)';
const darkCyanLime = 'var(--dark-cyan-lime, #16A34A)';
const colorHoverBgDark = 'var(--color-hover-bg-dark, #393C48)';
const colorToggleBgDisabledDarkTheme = 'var(--toggle-bg-disabled-dark-theme, #909CAF)';

const colorInfoBoxQuizText = 'var(--color-info-box-quiz-text, #15803D)';
const colorInfoBoxQuizBg = 'var(--color-info-box-quiz-bg, #F0FDF4)';
const colorInfoBoxQuizBorder = `var(--color-info-box-quiz-border, ${colorSuccess})`;

const colorSelectedCorrectAnswerText = 'var(--color-selected-correct-answer-text, #A16207)';
const colorSelectedCorrectAnswerBg = 'var(--color-selected-correct-answer-bg, #FEF9C3)';

const colorSelectedCorrectAnswerTextActive = 'var(--color-selected-correct-answer-text-active, #15803D)';
const colorSelectedCorrectAnswerBgActive = 'var(--color-selected-correct-answer-bg-active, #DCFCE7)';

const colorGreen600 = 'var(--color-green-600, #16A34A)';
const colorGreen100 = 'var(--color-green-100, #DCFCE7)';

export {
  roomControlBg,
  roomControlHoverBg,
  roomControlColor,
  roomControlActiveBg,
  roomControlActiveColor,
  roomLive,
  roomMutedText,
  roomRecording,
  roomRecordingText,
  roomLeaveBg,
  roomLeaveHoverBg,
  roomLeaveBorder,
  roomLeaveColor,
  roomFocusRing,
  panelTabsBg,
  panelTabColor,
  panelTabActiveColor,
  panelRaisedHandBadge,
  webcamTileBorder,
  webcamVideoBackground,
  webcamLabelBg,
  webcamRaisedHandBg,
  webcamRaisedHandColor,
  webcamOverflowBorder,
  stageControlBorder,
  stageControlColor,
  stageControlActiveBg,
  chatBubbleBg,
  chatOwnBubbleBg,
  panelText,
  panelMutedText,
  panelBorder,
  panelRowHoverBg,
  panelRowActionBg,
  panelRowActionHoverBg,
  panelRowActionColor,
  panelLive,
  panelLiveText,
  pollBarColor,
  panelStatusColor,
  panelStatusFaintColor,
  panelCameraColor,
  panelRaisedHandText,
  panelChipActiveBg,
  colorWhite,
  colorOffWhite,
  colorTldrawBackground,
  colorNeutral2,
  colorBlack,
  colorGray,
  colorGrayDark,
  colorGrayLight,
  colorGrayLighter,
  colorGrayLightest,
  colorGrayIcons,
  colorGrayUserListToolbar,
  colorBorder,
  colorTransparent,
  colorUserModerator,
  colorUserYou,
  colorUserViewer,
  colorBlueLight,
  colorBlueLighter,
  colorBlueLightest,
  colorBlueLightestChannel,
  colorBlueLighterChannel,
  colorBlueAux,
  colorBlueDark,
  colorPrimary,
  colorStandout,
  colorDanger,
  colorDangerDark,
  colorSuccess,
  colorWarning,
  colorBackground,
  colorOverlay,
  userListBg,
  userListText,
  unreadMessagesBg,
  notificationBadgeBg,
  colorGrayLabel,
  colorText,
  colorLink,
  listItemBgHover,
  colorTipBg,
  itemFocusBorder,
  btnDefaultColor,
  btnDefaultBg,
  btnDefaultBorder,
  btnDefaultGhostColor,
  btnDefaultGhostBg,
  btnDefaultGhostBorder,
  btnDefaultGhostActiveBg,
  btnRecordingActiveBg,
  btnRecordingActiveBorder,
  btnPrimaryBorder,
  btnPrimaryColor,
  btnPrimaryBg,
  btnPrimaryHoverBg,
  btnPrimaryActiveBg,
  btnSuccessBorder,
  btnSuccessColor,
  btnSuccessBg,
  btnWarningBorder,
  btnWarningColor,
  btnWarningBg,
  btnDangerBorder,
  btnDangerColor,
  btnDangerBg,
  btnDarkBorder,
  btnDarkColor,
  btnDarkBg,
  btnOfflineBorder,
  btnOfflineColor,
  btnOfflineBg,
  btnMutedBorder,
  btnMutedColor,
  btnMutedBg,
  toolbarButtonColor,
  toolbarButtonColorDisabled,
  userThumbnailBorder,
  loaderBg,
  loaderBullet,
  btnDangerBgHover,
  systemMessageBackgroundColor,
  systemMessageBorderColor,
  systemMessageFontColor,
  highlightedMessageBackgroundColor,
  highlightedMessageBorderColor,
  emphasizedMessageBackgroundColor,
  colorHeading,
  palettePlaceholderText,
  pollAnnotationGray,
  appsGalleryOutlineColor,
  unpinnedAppIconColor,
  appsPanelTextColor,
  settingsModalTabSelected,
  toolbarButtonBorderColor,
  toolbarListColor,
  toolbarButtonBg,
  toolbarListBg,
  toolbarListBgFocus,
  pollStatsBorderColor,
  pollBlue,
  colorContentBackground,
  dropdownBg,
  toastDefaultColor,
  toastDefaultBg,
  toastInfoColor,
  toastInfoBg,
  toastSuccessColor,
  toastSuccessBg,
  toastErrorColor,
  toastErrorBg,
  toastWarningColor,
  toastWarningBg,
  defaultBorder,
  webcamBackgroundColor,
  webcamPlaceholderBorder,
  colorBackgroundDarkTheme,
  colorOverlaysDarkTheme,
  colorToggleBgDisabledDarkTheme,
  colorTextDarkTheme,
  colorPrimaryDarkTheme,
  colorHoverBgDark,
  webcamTalkingBackgroundColor,
  SegmentedButtonRingOffsetShadow,
  SegmentedButtonRingShadow,
  SegmentedButtonBoxShadowSm,
  slate900,
  darkCyanLime,
  colorInfoBoxQuizText,
  colorInfoBoxQuizBg,
  colorInfoBoxQuizBorder,
  colorSelectedCorrectAnswerText,
  colorSelectedCorrectAnswerBg,
  colorSelectedCorrectAnswerTextActive,
  colorSelectedCorrectAnswerBgActive,
  colorGreen600,
  colorGreen100,
};
