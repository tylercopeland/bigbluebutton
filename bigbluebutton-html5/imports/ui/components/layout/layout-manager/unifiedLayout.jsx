import { useEffect, useRef } from 'react';
import { throttle } from '/imports/utils/throttle';
import { layoutSelect, layoutSelectInput, layoutDispatch } from '/imports/ui/components/layout/context';
import DEFAULT_VALUES, {
  DOCKED_PANEL_MAX_PERCENTAGE_WIDTH,
  DOCKED_PANEL_WIDTH,
  SIDEBAR_CONTENT_MARGIN_TO_MEDIA_PERCENTAGE_WIDTH,
  SIDEBAR_CONTENT_VERTICAL_MARGIN_PERCENTAGE_HEIGHT,
} from '/imports/ui/components/layout/defaultValues';
import { INITIAL_INPUT_STATE } from '/imports/ui/components/layout/initState';
import {
  ACTIONS, CAMERADOCK_POSITION, LAYOUT_TYPE, PANELS,
} from '../enums';
import Storage from '/imports/ui/services/storage/session';
import { defaultsDeep } from '/imports/utils/array-utils';
import { isPhoneLandscape } from '../utils';
import Session from '/imports/ui/services/storage/in-memory';
import getFromUserSettings from '/imports/ui/services/users-settings';
import usePanelSections from '/imports/ui/components/sidebar-content/sections/usePanelSections';
import usePanelSide from '/imports/ui/components/sidebar-content/usePanelSide';

const windowWidth = () => window.document.documentElement.clientWidth;
const windowHeight = () => window.document.documentElement.clientHeight;
const min = (value1, value2) => (value1 <= value2 ? value1 : value2);
const max = (value1, value2) => (value1 >= value2 ? value1 : value2);

const UnifiedLayout = (props) => {
  const {
    getNavBarBaseHeight,
    bannerAreaHeight, calculatesActionbarHeight, calculatesNavbarHeight, isMobile,
    prevLayout, isNavigationDocked,
  } = props;

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const input = layoutSelect((i) => i.input);
  const deviceType = layoutSelect((i) => i.deviceType);
  // For the layout, right-to-left only means that the side panel is on the right
  const { isStacked: isPanelStacked, hasAside } = usePanelSections();
  const { isPanelOnRight: isRTL, isMoved: isPanelMoved } = usePanelSide();
  const fullscreen = layoutSelect((i) => i.fullscreen);
  const fontSize = layoutSelect((i) => i.fontSize);
  const currentPanelType = layoutSelect((i) => i.currentPanelType);

  const presentationInput = layoutSelectInput((i) => i.presentation);
  const externalVideoInput = layoutSelectInput((i) => i.externalVideo);
  const genericMainContentInput = layoutSelectInput((i) => i.genericMainContent);
  const screenShareInput = layoutSelectInput((i) => i.screenShare);
  const sharedNotesInput = layoutSelectInput((i) => i.sharedNotes);

  const sidebarNavigationInput = layoutSelectInput((i) => i.sidebarNavigation);
  const sidebarContentInput = layoutSelectInput((i) => i.sidebarContent);
  const sidebarContentAuxiliaryInput = layoutSelectInput((i) => i.sidebarContentAuxiliary);
  const cameraDockInput = layoutSelectInput((i) => i.cameraDock);
  const actionbarInput = layoutSelectInput((i) => i.actionBar);
  const navbarInput = layoutSelectInput((i) => i.navBar);
  const layoutContextDispatch = layoutDispatch();

  const { isResizing } = cameraDockInput;

  const prevDeviceType = usePrevious(deviceType);
  const prevIsResizing = usePrevious(isResizing);
  const { isPresentationEnabled } = props;

  // The calls below are deferred, they run after every function is defined.
  // eslint-disable-next-line no-use-before-define
  const throttledCalculatesLayout = throttle(() => calculatesLayout(),
    50, { trailing: true, leading: true });

  useEffect(() => {
    window.addEventListener('resize', () => {
      layoutContextDispatch({
        type: ACTIONS.SET_BROWSER_SIZE,
        value: {
          width: window.document.documentElement.clientWidth,
          height: window.document.documentElement.clientHeight,
        },
      });
    });
  }, []);

  useEffect(() => {
    if (deviceType === null) return () => null;

    if (deviceType !== prevDeviceType) {
      // reset layout if deviceType changed
      // not all options is supported in all devices
      // eslint-disable-next-line no-use-before-define
      init();
    } else {
      throttledCalculatesLayout();
    }
    return () => null;
  }, [
    input, deviceType, isRTL, isPanelMoved, fontSize, fullscreen,
    isPresentationEnabled, isNavigationDocked, isPanelStacked, hasAside,
  ]);

  const calculatesDropAreas = (sidebarNavWidth, sidebarContentWidth, cameraDockBounds) => {
    const { sidebarContentAuxiliary } = input;
    const isMultiFunctionalModeActive = sidebarContentAuxiliary.isOpen;
    const { height: actionBarHeight } = calculatesActionbarHeight();
    const mediaAreaHeight = windowHeight() - (getNavBarBaseHeight() + actionBarHeight);
    const sidebarContentMarginToMedia = windowWidth()
      * SIDEBAR_CONTENT_MARGIN_TO_MEDIA_PERCENTAGE_WIDTH;
    const mediaAreaWidth = windowWidth()
      - (sidebarNavWidth + sidebarContentWidth) - sidebarContentMarginToMedia;
    const DROP_ZONE_DEFAUL_SIZE = 100;
    const dropZones = {};
    const sidebarSize = sidebarNavWidth + sidebarContentWidth;

    dropZones[CAMERADOCK_POSITION.CONTENT_TOP] = {
      top: getNavBarBaseHeight(),
      left: !isRTL ? sidebarSize : null,
      right: isRTL ? sidebarSize : null,
      width: mediaAreaWidth,
      height: DROP_ZONE_DEFAUL_SIZE,
      zIndex: cameraDockBounds.zIndex,
    };

    dropZones[CAMERADOCK_POSITION.CONTENT_RIGHT] = {
      top: getNavBarBaseHeight() + DROP_ZONE_DEFAUL_SIZE,
      left: isRTL
        ? sidebarContentMarginToMedia
        : windowWidth() - DROP_ZONE_DEFAUL_SIZE - sidebarContentMarginToMedia,
      height: mediaAreaHeight - 2 * DROP_ZONE_DEFAUL_SIZE,
      width: DROP_ZONE_DEFAUL_SIZE,
      zIndex: cameraDockBounds.zIndex,
    };

    dropZones[CAMERADOCK_POSITION.CONTENT_BOTTOM] = {
      top: getNavBarBaseHeight() + mediaAreaHeight - DROP_ZONE_DEFAUL_SIZE,
      left: !isRTL ? sidebarSize : null,
      right: isRTL ? sidebarSize : null,
      width: mediaAreaWidth,
      height: DROP_ZONE_DEFAUL_SIZE,
      zIndex: cameraDockBounds.zIndex,
    };

    dropZones[CAMERADOCK_POSITION.CONTENT_LEFT] = {
      top: getNavBarBaseHeight() + DROP_ZONE_DEFAUL_SIZE,
      left: !isRTL ? sidebarSize : null,
      right: isRTL ? sidebarSize : null,
      height: mediaAreaHeight - 2 * DROP_ZONE_DEFAUL_SIZE,
      width: DROP_ZONE_DEFAUL_SIZE,
      zIndex: cameraDockBounds.zIndex,
    };

    if (!isMultiFunctionalModeActive && !isPanelStacked) {
      dropZones[CAMERADOCK_POSITION.SIDEBAR_CONTENT_BOTTOM] = {
        top: windowHeight() - DROP_ZONE_DEFAUL_SIZE,
        left: !isRTL ? sidebarNavWidth : null,
        right: isRTL ? sidebarNavWidth : null,
        width: sidebarContentWidth ? sidebarContentWidth - sidebarContentMarginToMedia : 0,
        height: DROP_ZONE_DEFAUL_SIZE,
        zIndex: cameraDockBounds.zIndex,
      };
    }

    return dropZones;
  };

  const init = () => {
    const hasLayoutEngineLoadedOnce = Session.getItem('hasLayoutEngineLoadedOnce');
    if (isMobile) {
      layoutContextDispatch({
        type: ACTIONS.SET_LAYOUT_INPUT,
        value: (prevInput) => {
          const {
            sidebarNavigation, sidebarContent, presentation, cameraDock,
            externalVideo, genericMainContent, screenShare, sharedNotes,
          } = prevInput;
          const { sidebarContentPanel } = sidebarContent;
          const overrideOpenSidebarPanel = !getFromUserSettings('bbb_hide_sidebar_navigation', false)
            && sidebarContentPanel !== PANELS.NONE;
          const overrideOpenSidebarNavigation = !getFromUserSettings('bbb_hide_sidebar_navigation', false)
            && (sidebarNavigation.isOpen || sidebarContentPanel !== PANELS.NONE || false);
          const { registeredApps, pinnedApps } = sidebarNavigation;
          return defaultsDeep(
            {
              sidebarNavigation: {
                isOpen: overrideOpenSidebarNavigation,
                registeredApps,
                pinnedApps,
              },
              sidebarContent: {
                isOpen: overrideOpenSidebarPanel,
                sidebarContentPanel: sidebarContent.sidebarContentPanel,
              },
              sidebarContentAuxiliary: {
                isOpen: false,
                sidebarContentPanel: PANELS.NONE,
              },
              presentation: {
                isOpen: presentation.isOpen,
                slidesLength: presentation.slidesLength,
                currentSlide: {
                  ...presentation.currentSlide,
                },
              },
              cameraDock: {
                position: cameraDock.position || DEFAULT_VALUES.cameraPosition,
                numCameras: cameraDock.numCameras,
              },
              externalVideo: {
                hasExternalVideo: externalVideo.hasExternalVideo,
              },
              genericMainContent: {
                genericContentId: genericMainContent.genericContentId,
              },
              screenShare: {
                hasScreenShare: screenShare.hasScreenShare,
                width: screenShare.width,
                height: screenShare.height,
              },
              sharedNotes: {
                isPinned: sharedNotes.isPinned,
              },
            },
            hasLayoutEngineLoadedOnce ? prevInput : INITIAL_INPUT_STATE,
          );
        },
      });
    } else {
      layoutContextDispatch({
        type: ACTIONS.SET_LAYOUT_INPUT,
        value: (prevInput) => {
          const {
            sidebarNavigation, sidebarContent, presentation, cameraDock,
            externalVideo, genericMainContent, screenShare, sharedNotes,
          } = prevInput;
          const { sidebarContentPanel } = sidebarContent;
          let sidebarContentPanelOverride = sidebarContentPanel;
          let overrideOpenSidebarPanel = sidebarContentPanel !== PANELS.NONE;
          let overrideOpenSidebarNavigation = sidebarNavigation.isOpen
            || sidebarContentPanel !== PANELS.NONE || false;
          if (prevLayout === LAYOUT_TYPE.CAMERAS_ONLY
            || prevLayout === LAYOUT_TYPE.PRESENTATION_ONLY
            || prevLayout === LAYOUT_TYPE.MEDIA_ONLY) {
            overrideOpenSidebarNavigation = true;
            overrideOpenSidebarPanel = true;
            sidebarContentPanelOverride = PANELS.CHAT;
          }
          return defaultsDeep(
            {
              sidebarNavigation: {
                isOpen: overrideOpenSidebarNavigation,
              },
              sidebarContent: {
                isOpen: overrideOpenSidebarPanel,
                sidebarContentPanel: sidebarContentPanelOverride,
              },
              sidebarContentAuxiliary: {
                isOpen: false,
                sidebarContentPanel: PANELS.NONE,
              },
              presentation: {
                isOpen: presentation.isOpen,
                slidesLength: presentation.slidesLength,
                currentSlide: {
                  ...presentation.currentSlide,
                },
              },
              cameraDock: {
                position: cameraDock.position || DEFAULT_VALUES.cameraPosition,
                numCameras: cameraDock.numCameras,
              },
              externalVideo: {
                hasExternalVideo: externalVideo.hasExternalVideo,
              },
              genericMainContent: {
                genericContentId: genericMainContent.genericContentId,
              },
              screenShare: {
                hasScreenShare: screenShare.hasScreenShare,
                width: screenShare.width,
                height: screenShare.height,
              },
              sharedNotes: {
                isPinned: sharedNotes.isPinned,
              },
            },
            hasLayoutEngineLoadedOnce ? prevInput : INITIAL_INPUT_STATE,
          );
        },
      });
    }
    Session.setItem('layoutReady', true);
    throttledCalculatesLayout();
  };

  const isMediaContentOff = () => {
    const { slidesLength } = presentationInput;
    const { hasExternalVideo } = externalVideoInput;
    const { genericContentId } = genericMainContentInput;
    const { hasScreenShare } = screenShareInput;
    const { isPinned: isSharedNotesPinned } = sharedNotesInput;

    const hasPresentation = isPresentationEnabled && slidesLength !== 0;

    return !hasPresentation && !hasExternalVideo
      && !hasScreenShare && !isSharedNotesPinned && !genericContentId;
  };

  const isSideBySideCamerasEnforced = () => isPhoneLandscape(input.browser)
    && cameraDockInput.numCameras > 0
    && presentationInput.isOpen
    && !isMediaContentOff();

  // CONTENT_RIGHT mirrors under RTL, as every other camera position does.
  const isCameraDockUnmoved = () => isNavigationDocked
    && cameraDockInput.position === CAMERADOCK_POSITION.CONTENT_TOP
    && !Session.getItem('cameraDockWasMoved');

  const hasAutomaticCameraPosition = () => isCameraDockUnmoved()
    && presentationInput.isOpen
    && !isMediaContentOff();

  const getCameraDockPosition = () => {
    if (isSideBySideCamerasEnforced()) return CAMERADOCK_POSITION.CONTENT_RIGHT;
    // Until the dock is moved: a row across the top of the stage while the side
    // panel is open, and a column on the right while it is closed
    if (hasAutomaticCameraPosition()) {
      return input.sidebarContent.isOpen || hasAside
        ? CAMERADOCK_POSITION.CONTENT_TOP
        : CAMERADOCK_POSITION.CONTENT_RIGHT;
    }
    return cameraDockInput.position;
  };

  const calculatesSidebarContentHeight = (cameraDockHeight) => {
    const { isOpen } = presentationInput;
    const {
      sidebarContentMinHeight,
    } = DEFAULT_VALUES;

    let sidebarContentHeight = 0;
    if (sidebarContentInput.isOpen) {
      if (isMobile) {
        sidebarContentHeight = windowHeight() - getNavBarBaseHeight();
      } else if (
        cameraDockInput.numCameras > 0
        && getCameraDockPosition() === CAMERADOCK_POSITION.SIDEBAR_CONTENT_BOTTOM
        && isOpen
        && !isMediaContentOff()
      ) {
        sidebarContentHeight = windowHeight() - cameraDockHeight;
      } else {
        sidebarContentHeight = windowHeight();
      }
      sidebarContentHeight -= bannerAreaHeight();
    }
    return {
      height: sidebarContentHeight,
      minHeight: sidebarContentMinHeight,
      maxHeight: sidebarContentHeight,
    };
  };

  const calculatesCameraDockBounds = (sidebarNavWidth, sidebarContentWidth, mediaAreaBounds) => {
    const { baseCameraDockBounds } = props;
    const sidebarSize = sidebarNavWidth + sidebarContentWidth;

    const baseBounds = baseCameraDockBounds(mediaAreaBounds, sidebarSize);

    // do not proceed if using values from LayoutEngine
    if (Object.keys(baseBounds).length > 0) {
      return baseBounds;
    }

    const {
      camerasMargin,
      cameraDockMinHeight,
      cameraDockMinWidth,
      cameraDockDockedWidth,
      phoneLandscapeCameraWidthPercentage,
      presentationToolbarMinWidth,
      sidebarContentMinHeight,
    } = DEFAULT_VALUES;

    const navBarHeight = calculatesNavbarHeight();

    const cameraDockBounds = {};

    let cameraDockHeight = 0;
    let cameraDockWidth = 0;

    const lastSize = Storage.getItem('webcamSize') || { width: 0, height: 0 };
    let { width: lastWidth, height: lastHeight } = lastSize;

    if (cameraDockInput.isDragging) cameraDockBounds.zIndex = 99;
    else cameraDockBounds.zIndex = 1;

    const cameraPosition = getCameraDockPosition();
    const isEnforcedSideBySide = isSideBySideCamerasEnforced();

    const isCameraTop = cameraPosition === CAMERADOCK_POSITION.CONTENT_TOP;
    const isCameraBottom = cameraPosition === CAMERADOCK_POSITION.CONTENT_BOTTOM;
    const isCameraLeft = cameraPosition === CAMERADOCK_POSITION.CONTENT_LEFT;
    const isCameraRight = cameraPosition === CAMERADOCK_POSITION.CONTENT_RIGHT;
    const isCameraSidebar = cameraPosition === CAMERADOCK_POSITION.SIDEBAR_CONTENT_BOTTOM;

    const stoppedResizing = prevIsResizing && !isResizing;
    if (stoppedResizing) {
      const isCameraTopOrBottom = isCameraTop || isCameraBottom;
      const sidebarContentMarginToMedia = windowWidth()
        * SIDEBAR_CONTENT_MARGIN_TO_MEDIA_PERCENTAGE_WIDTH;

      Storage.setItem('webcamSize', {
        width: (isCameraTopOrBottom || isCameraSidebar)
          ? lastWidth
          : cameraDockInput.width - sidebarContentMarginToMedia,
        height: isCameraTopOrBottom || isCameraSidebar ? cameraDockInput.height : lastHeight,
      });

      const updatedLastSize = Storage.getItem('webcamSize');
      lastWidth = updatedLastSize.width;
      lastHeight = updatedLastSize.height;
    }

    if (isCameraTop || isCameraBottom) {
      if ((lastHeight === 0 && !isResizing) || (isCameraTop && isMobile)) {
        cameraDockHeight = min(
          max(isNavigationDocked ? 0 : mediaAreaBounds.height * 0.2, cameraDockMinHeight),
          mediaAreaBounds.height - cameraDockMinHeight,
        );
      } else {
        const height = isResizing ? cameraDockInput.height : lastHeight;
        cameraDockHeight = min(
          max(height, cameraDockMinHeight),
          mediaAreaBounds.height - cameraDockMinHeight,
        );
      }

      cameraDockBounds.top = navBarHeight + bannerAreaHeight();
      cameraDockBounds.left = mediaAreaBounds.left;
      cameraDockBounds.right = isRTL ? sidebarSize : null;
      cameraDockBounds.minWidth = mediaAreaBounds.width;
      cameraDockBounds.width = mediaAreaBounds.width;
      cameraDockBounds.maxWidth = mediaAreaBounds.width;
      cameraDockBounds.minHeight = cameraDockMinHeight;
      cameraDockBounds.height = cameraDockHeight;
      cameraDockBounds.maxHeight = mediaAreaBounds.height * 0.8;

      if (isCameraBottom) {
        cameraDockBounds.top += mediaAreaBounds.height - cameraDockHeight;
      }

      return cameraDockBounds;
    }

    if (isCameraLeft || isCameraRight) {
      if (isEnforcedSideBySide) {
        // max() on the upper bound too: it inverts below twice cameraDockMinWidth.
        cameraDockWidth = min(
          max(
            mediaAreaBounds.width * phoneLandscapeCameraWidthPercentage,
            cameraDockMinWidth,
          ),
          max(mediaAreaBounds.width - cameraDockMinWidth, cameraDockMinWidth),
        );
      } else if (lastWidth === 0 && !isResizing) {
        cameraDockWidth = min(
          max(
            isNavigationDocked ? cameraDockDockedWidth : mediaAreaBounds.width * 0.2,
            cameraDockMinWidth,
          ),
          mediaAreaBounds.width - cameraDockMinWidth,
        );
      } else {
        const width = isResizing ? cameraDockInput.width : lastWidth;
        cameraDockWidth = min(
          max(width, cameraDockMinWidth),
          mediaAreaBounds.width - cameraDockMinWidth,
        );
      }

      cameraDockBounds.top = navBarHeight + bannerAreaHeight();
      cameraDockBounds.minWidth = isEnforcedSideBySide ? cameraDockWidth : cameraDockMinWidth;
      cameraDockBounds.width = cameraDockWidth;
      cameraDockBounds.maxWidth = isEnforcedSideBySide
        ? cameraDockWidth
        : mediaAreaBounds.width * 0.8;
      cameraDockBounds.presenterMaxWidth = isEnforcedSideBySide
        ? cameraDockWidth
        : mediaAreaBounds.width - presentationToolbarMinWidth - camerasMargin;
      cameraDockBounds.minHeight = cameraDockMinHeight;
      cameraDockBounds.height = mediaAreaBounds.height;
      cameraDockBounds.maxHeight = mediaAreaBounds.height;
      // button size in vertical position
      cameraDockBounds.height -= 20;

      if (isCameraRight) {
        const sizeValue = mediaAreaBounds.left + mediaAreaBounds.width - cameraDockWidth;
        cameraDockBounds.left = isRTL ? 0 : sizeValue;
        cameraDockBounds.right = isRTL ? sizeValue + sidebarSize : null;
      } else if (isCameraLeft) {
        cameraDockBounds.left = mediaAreaBounds.left;
        cameraDockBounds.right = isRTL ? sidebarSize : null;
      }

      return cameraDockBounds;
    }

    if (isCameraSidebar) {
      if (lastHeight === 0 && !isResizing) {
        cameraDockHeight = min(
          max(windowHeight() * 0.2, cameraDockMinHeight),
          windowHeight() - cameraDockMinHeight,
        );
      } else {
        const height = isResizing ? cameraDockInput.height : lastHeight;
        cameraDockHeight = min(
          max(height, cameraDockMinHeight),
          windowHeight() - cameraDockMinHeight,
        );
      }
      const sidebarContentVerticalMargin = windowHeight()
        * SIDEBAR_CONTENT_VERTICAL_MARGIN_PERCENTAGE_HEIGHT;
      const sidebarContentMarginToMedia = windowWidth()
        * SIDEBAR_CONTENT_MARGIN_TO_MEDIA_PERCENTAGE_WIDTH;

      cameraDockBounds.top = windowHeight() - cameraDockHeight - bannerAreaHeight();
      if (!isNavigationDocked) {
        cameraDockBounds.top += sidebarContentMarginToMedia - sidebarContentVerticalMargin;
      }
      cameraDockBounds.left = !isRTL ? sidebarNavWidth : 0;
      cameraDockBounds.right = isRTL ? sidebarNavWidth : 0;
      cameraDockBounds.minWidth = sidebarContentWidth;
      cameraDockBounds.width = sidebarContentWidth;
      cameraDockBounds.maxWidth = sidebarContentWidth;
      cameraDockBounds.minHeight = cameraDockMinHeight;
      cameraDockBounds.height = cameraDockHeight;
      cameraDockBounds.maxHeight = windowHeight() - bannerAreaHeight() - sidebarContentMinHeight;
    }
    return cameraDockBounds;
  };

  const calculatesMediaBounds = (sidebarNavWidth, sidebarContentWidth, cameraDockBounds) => {
    const { isOpen, slidesLength } = presentationInput;
    const { hasExternalVideo } = externalVideoInput;
    const { genericContentId } = genericMainContentInput;
    const { hasScreenShare } = screenShareInput;
    const { isPinned: isSharedNotesPinned } = sharedNotesInput;

    const { height: actionBarHeight } = calculatesActionbarHeight();
    const navBarHeight = calculatesNavbarHeight();
    const mediaAreaHeight = windowHeight()
      - (getNavBarBaseHeight() + actionBarHeight + bannerAreaHeight());
    const sidebarContentMarginToMedia = windowWidth()
      * SIDEBAR_CONTENT_MARGIN_TO_MEDIA_PERCENTAGE_WIDTH;
    const mediaAreaWidth = windowWidth()
      - (sidebarNavWidth + sidebarContentWidth) - (isMobile ? 0 : sidebarContentMarginToMedia);
    const mediaBounds = {};
    const { element: fullscreenElement } = fullscreen;
    const { camerasMargin } = DEFAULT_VALUES;

    const hasPresentation = (isPresentationEnabled && slidesLength !== 0) || isOpen;
    const isGeneralMediaOff = !hasPresentation && !hasExternalVideo
      && !hasScreenShare && !isSharedNotesPinned && !genericContentId;

    if (!isOpen || isGeneralMediaOff) {
      mediaBounds.width = 0;
      mediaBounds.height = 0;
      mediaBounds.top = 0;
      mediaBounds.left = !isRTL ? 0 : null;
      mediaBounds.right = isRTL ? 0 : null;
      mediaBounds.zIndex = 0;
      return mediaBounds;
    }

    if (
      fullscreenElement === 'Presentation'
      || fullscreenElement === 'Screenshare'
      || fullscreenElement === 'ExternalVideo'
      || fullscreenElement === 'GenericContent'
    ) {
      mediaBounds.width = windowWidth();
      mediaBounds.height = windowHeight();
      mediaBounds.top = 0;
      mediaBounds.left = !isRTL ? 0 : null;
      mediaBounds.right = isRTL ? 0 : null;
      mediaBounds.zIndex = 99;
      return mediaBounds;
    }

    const sidebarSize = sidebarNavWidth + sidebarContentWidth;

    if (cameraDockInput.numCameras > 0 && !cameraDockInput.isDragging) {
      switch (getCameraDockPosition()) {
        case CAMERADOCK_POSITION.CONTENT_TOP: {
          mediaBounds.width = mediaAreaWidth;
          mediaBounds.height = mediaAreaHeight - cameraDockBounds.height - camerasMargin;
          mediaBounds.top = navBarHeight + cameraDockBounds.height
            + camerasMargin + bannerAreaHeight();
          mediaBounds.left = !isRTL ? sidebarSize : null;
          mediaBounds.right = isRTL ? sidebarSize : null;
          break;
        }
        case CAMERADOCK_POSITION.CONTENT_RIGHT: {
          // Clamped: a negative width reads as open to the `width === 0` guards.
          mediaBounds.width = max(mediaAreaWidth - cameraDockBounds.width - camerasMargin * 2, 0);
          mediaBounds.height = mediaAreaHeight;
          mediaBounds.top = navBarHeight + bannerAreaHeight();
          mediaBounds.left = !isRTL ? sidebarSize : null;
          mediaBounds.right = isRTL ? sidebarSize - camerasMargin * 2 : null;
          break;
        }
        case CAMERADOCK_POSITION.CONTENT_BOTTOM: {
          mediaBounds.width = mediaAreaWidth;
          mediaBounds.height = mediaAreaHeight - cameraDockBounds.height - camerasMargin;
          mediaBounds.top = navBarHeight - camerasMargin + bannerAreaHeight();
          mediaBounds.left = !isRTL ? sidebarSize : null;
          mediaBounds.right = isRTL ? sidebarSize : null;
          break;
        }
        case CAMERADOCK_POSITION.CONTENT_LEFT: {
          mediaBounds.width = max(mediaAreaWidth - cameraDockBounds.width - camerasMargin * 2, 0);
          mediaBounds.height = mediaAreaHeight;
          mediaBounds.top = navBarHeight + bannerAreaHeight();
          const sizeValue = sidebarNavWidth + sidebarContentWidth
            + mediaAreaWidth - mediaBounds.width;
          mediaBounds.left = !isRTL ? sizeValue : null;
          mediaBounds.right = isRTL ? sidebarSize : null;
          break;
        }
        case CAMERADOCK_POSITION.SIDEBAR_CONTENT_BOTTOM: {
          mediaBounds.width = mediaAreaWidth;
          mediaBounds.height = mediaAreaHeight;
          mediaBounds.top = navBarHeight + bannerAreaHeight();
          mediaBounds.left = !isRTL ? sidebarSize : null;
          mediaBounds.right = isRTL ? sidebarSize : null;
          break;
        }
        default: {
          console.log('presentation - camera default');
        }
      }
      mediaBounds.zIndex = 1;
    } else {
      mediaBounds.width = mediaAreaWidth;
      mediaBounds.height = mediaAreaHeight;
      mediaBounds.top = navBarHeight + bannerAreaHeight();
      mediaBounds.left = !isRTL ? sidebarSize : null;
      mediaBounds.right = isRTL ? sidebarSize : null;
    }

    return mediaBounds;
  };

  const calculatesLayout = () => {
    const {
      calculatesNavbarBounds,
      calculatesActionbarBounds,
      calculatesSidebarNavWidth,
      calculatesSidebarNavHeight,
      calculatesSidebarNavBounds,
      calculatesSidebarContentWidth,
      calculatesSidebarContentBounds,
      calculatesMediaAreaBounds,
      isTablet,
    } = props;
    const cameraPosition = getCameraDockPosition();
    const isCameraDockLocked = isSideBySideCamerasEnforced();
    const { camerasMargin, captionsMargin } = DEFAULT_VALUES;

    const sidebarNavWidth = calculatesSidebarNavWidth();
    const sidebarNavHeight = calculatesSidebarNavHeight();
    const sidebarContentWidth = calculatesSidebarContentWidth();
    // A tool docked across the stage takes the auxiliary panel's room, on the far side
    const asideWidth = hasAside
      ? min(DOCKED_PANEL_WIDTH, windowWidth() * DOCKED_PANEL_MAX_PERCENTAGE_WIDTH)
      : 0;
    const sidebarContentAuxiliaryWidth = hasAside
      ? { minWidth: asideWidth, width: asideWidth, maxWidth: asideWidth }
      : calculatesSidebarContentWidth(true);
    const sidebarNavBounds = calculatesSidebarNavBounds();
    const sidebarContentBounds = calculatesSidebarContentBounds(
      sidebarNavWidth.horizontalSpaceOccupied,
    );
    const mediaAreaBounds = calculatesMediaAreaBounds(
      sidebarNavWidth.horizontalSpaceOccupied,
      sidebarContentWidth.width + sidebarContentAuxiliaryWidth.width,
    );
    const navbarBounds = calculatesNavbarBounds(mediaAreaBounds);
    const actionbarBounds = calculatesActionbarBounds(mediaAreaBounds);
    const cameraDockBounds = calculatesCameraDockBounds(
      sidebarNavWidth.horizontalSpaceOccupied,
      sidebarContentWidth.width + sidebarContentAuxiliaryWidth.width,
      mediaAreaBounds,
    );
    const dropZoneAreas = calculatesDropAreas(
      sidebarNavWidth.horizontalSpaceOccupied,
      sidebarContentWidth.width + sidebarContentAuxiliaryWidth.width,
      cameraDockBounds,
    );
    const {
      height: sidebarContentHeight,
      minHeight: sidebarContentMinHeight,
      maxHeight: sidebarContentMaxHeight,
    } = calculatesSidebarContentHeight(cameraDockBounds.height);
    const mediaBounds = calculatesMediaBounds(
      sidebarNavWidth.horizontalSpaceOccupied,
      sidebarContentWidth.width + sidebarContentAuxiliaryWidth.width,
      cameraDockBounds,
    );
    const sidebarSize = sidebarContentWidth.width
      + sidebarContentAuxiliaryWidth.width
      + (isNavigationDocked ? sidebarNavWidth.horizontalSpaceOccupied : sidebarNavWidth.width);
    const { height: actionBarHeight } = calculatesActionbarHeight();

    let horizontalCameraDiff = 0;

    if (cameraPosition === CAMERADOCK_POSITION.CONTENT_LEFT) {
      horizontalCameraDiff = cameraDockBounds.width + camerasMargin * 2;
    }

    if (cameraPosition === CAMERADOCK_POSITION.CONTENT_RIGHT) {
      horizontalCameraDiff = camerasMargin * 2;
    }

    // The page positions things from the side its language starts at. When the panel
    // is on the opposite side, that has to be spelled out.
    const mediaRight = isRTL ? mediaBounds.right + horizontalCameraDiff : null;
    let mediaHorizontal = { left: mediaBounds.left, right: mediaRight };
    const cameraHorizontal = { left: cameraDockBounds.left, right: cameraDockBounds.right };

    if (isPanelMoved) {
      const isMediaFullscreen = mediaBounds.width === windowWidth();
      let mediaLeft = mediaBounds.left;
      if (isRTL) mediaLeft = windowWidth() - mediaRight - mediaBounds.width;
      if (isMediaFullscreen) mediaLeft = 0;
      mediaHorizontal = {
        left: mediaLeft,
        right: windowWidth() - mediaLeft - mediaBounds.width,
      };

      // The webcams move by left - right, from the side the language starts at
      const cameraOffset = (cameraDockBounds.left || 0) - (cameraDockBounds.right || 0);
      const cameraSpace = windowWidth() - cameraDockBounds.width;
      cameraHorizontal.left = isRTL ? cameraOffset + cameraSpace : cameraOffset - cameraSpace;
      cameraHorizontal.right = 0;
    }

    // The sizes above already leave room for the docked panel, but place it next
    // to the side panel. It sits at the far edge instead, so what is between the
    // two moves over by its width. Fullscreen content is left where it is.
    const asideShift = isRTL ? asideWidth : -asideWidth;
    const shift = (bounds, isFullscreen = false) => {
      if (!asideShift || isFullscreen) return bounds;
      return {
        ...bounds,
        left: typeof bounds.left === 'number' ? bounds.left + asideShift : bounds.left,
        right: typeof bounds.right === 'number' ? bounds.right - asideShift : bounds.right,
      };
    };
    const isStageFullscreen = mediaBounds.width === windowWidth();
    const shiftedMedia = shift(mediaHorizontal, isStageFullscreen);
    // The webcams move by left - right on screen, whichever way the page reads
    const shiftedCamera = fullscreen.group === 'webcams' ? cameraHorizontal : {
      left: (cameraHorizontal.left || 0) + asideShift,
      right: cameraHorizontal.right,
    };
    const shiftedDropAreas = Object.fromEntries(
      Object.entries(dropZoneAreas).map(([key, area]) => [
        key, key === CAMERADOCK_POSITION.SIDEBAR_CONTENT_BOTTOM ? area : shift(area),
      ]),
    );

    layoutContextDispatch({
      type: ACTIONS.SET_NAVBAR_OUTPUT,
      value: {
        display: navbarInput.hasNavBar,
        width: navbarBounds.width,
        height: navbarBounds.height,
        top: navbarBounds.top,
        left: shift({ left: navbarBounds.left }).left,
        tabOrder: DEFAULT_VALUES.navBarTabOrder,
        zIndex: navbarBounds.zIndex,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_ACTIONBAR_OUTPUT,
      value: {
        display: actionbarInput.hasActionBar,
        width: actionbarBounds.width,
        height: actionbarBounds.height,
        innerHeight: actionbarBounds.innerHeight,
        top: actionbarBounds.top,
        left: shift({ left: actionbarBounds.left }).left,
        padding: actionbarBounds.padding,
        tabOrder: DEFAULT_VALUES.actionBarTabOrder,
        zIndex: actionbarBounds.zIndex,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_CAPTIONS_OUTPUT,
      value: {
        ...shift({
          left: !isRTL ? sidebarSize + captionsMargin : null,
          right: isRTL ? sidebarSize + captionsMargin : null,
        }),
        maxWidth: mediaAreaBounds.width - captionsMargin * 2,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_SIDEBAR_NAVIGATION_OUTPUT,
      value: {
        display: sidebarNavigationInput.isOpen,
        minWidth: sidebarNavWidth.minWidth,
        width: sidebarNavWidth.width,
        maxWidth: sidebarNavWidth.maxWidth,
        height: sidebarNavHeight,
        top: sidebarNavBounds.top,
        left: sidebarNavBounds.left,
        right: sidebarNavBounds.right,
        tabOrder: DEFAULT_VALUES.sidebarNavTabOrder,
        isResizable: !isMobile && !isTablet,
        zIndex: sidebarNavBounds.zIndex,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_SIDEBAR_CONTENT_OUTPUT,
      value: {
        display: sidebarContentInput.isOpen,
        minWidth: sidebarContentWidth.minWidth,
        width: sidebarContentWidth.width,
        maxWidth: sidebarContentWidth.maxWidth,
        height: sidebarContentHeight,
        minHeight: sidebarContentMinHeight,
        maxHeight: sidebarContentMaxHeight,
        top: sidebarContentBounds.top,
        left: sidebarContentBounds.left,
        right: sidebarContentBounds.right,
        currentPanelType,
        tabOrder: DEFAULT_VALUES.sidebarContentTabOrder,
        isResizable: !isMobile && !isTablet,
        zIndex: sidebarContentBounds.zIndex,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_SIDEBAR_CONTENT_AUXILIARY_OUTPUT,
      value: hasAside ? {
        display: true,
        minWidth: asideWidth,
        width: asideWidth,
        maxWidth: asideWidth,
        height: windowHeight() - bannerAreaHeight(),
        minHeight: sidebarContentMinHeight,
        maxHeight: windowHeight() - bannerAreaHeight(),
        top: sidebarContentBounds.top,
        // From the window's left edge, whichever way the page reads
        left: isRTL ? 0 : windowWidth() - asideWidth,
        right: null,
        currentPanelType,
        tabOrder: DEFAULT_VALUES.sidebarContentTabOrder,
        isResizable: false,
        zIndex: sidebarContentBounds.zIndex,
      } : {
        display: sidebarContentAuxiliaryInput.isOpen,
        minWidth: sidebarContentAuxiliaryWidth.minWidth,
        width: sidebarContentAuxiliaryWidth.width,
        maxWidth: sidebarContentAuxiliaryWidth.maxWidth,
        height: sidebarContentHeight,
        minHeight: sidebarContentMinHeight,
        maxHeight: sidebarContentMaxHeight,
        top: sidebarContentBounds.top,
        left: !isRTL ? sidebarContentBounds.left
          + sidebarContentWidth.width : null,
        right: isRTL ? sidebarContentBounds.right
          + sidebarContentWidth.width : null,
        currentPanelType,
        tabOrder: DEFAULT_VALUES.sidebarContentTabOrder,
        isResizable: !isMobile && !isTablet,
        zIndex: sidebarContentBounds.zIndex,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_SIDEBAR_CONTENT_RESIZABLE_EDGE,
      value: {
        top: false,
        right: !isRTL,
        bottom: false,
        left: isRTL,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_SIDEBAR_CONTENT_AUXILIARY_RESIZABLE_EDGE,
      value: {
        top: false,
        right: !isRTL,
        bottom: false,
        left: isRTL,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_MEDIA_AREA_SIZE,
      value: {
        width: windowWidth() - sidebarContentWidth.width - asideWidth
          - (isNavigationDocked ? sidebarNavWidth.horizontalSpaceOccupied : sidebarNavWidth.width)
          - (windowWidth() * SIDEBAR_CONTENT_MARGIN_TO_MEDIA_PERCENTAGE_WIDTH),
        height: windowHeight() - getNavBarBaseHeight() - actionBarHeight,
      },
    });

    const isMediaOpen = mediaBounds?.width > 0 && mediaBounds?.height > 0;
    const canResizeCameraDock = isMediaOpen && !isCameraDockLocked;

    layoutContextDispatch({
      type: ACTIONS.SET_CAMERA_DOCK_OUTPUT,
      value: {
        display: cameraDockInput.numCameras > 0 || !presentationInput.isOpen,
        position: cameraPosition,
        minWidth: cameraDockBounds.minWidth,
        width: cameraDockBounds.width,
        maxWidth: cameraDockBounds.maxWidth,
        presenterMaxWidth: cameraDockBounds.presenterMaxWidth,
        minHeight: cameraDockBounds.minHeight,
        height: cameraDockBounds.height,
        maxHeight: cameraDockBounds.maxHeight,
        top: cameraDockBounds.top,
        left: shiftedCamera.left,
        right: shiftedCamera.right,
        tabOrder: 4,
        isDraggable: !isMobile && !isTablet && !isCameraDockLocked && isMediaOpen,
        resizableEdge: {
          top:
          canResizeCameraDock
            && (cameraPosition === CAMERADOCK_POSITION.CONTENT_BOTTOM
            || (cameraPosition === CAMERADOCK_POSITION.SIDEBAR_CONTENT_BOTTOM
            && input.sidebarContent.isOpen)),
          right:
            canResizeCameraDock
            && ((!isRTL && cameraPosition === CAMERADOCK_POSITION.CONTENT_LEFT)
            || (isRTL && cameraPosition === CAMERADOCK_POSITION.CONTENT_RIGHT)),
          bottom: canResizeCameraDock
            && cameraPosition === CAMERADOCK_POSITION.CONTENT_TOP,
          left:
          canResizeCameraDock
            && ((!isRTL && cameraPosition === CAMERADOCK_POSITION.CONTENT_RIGHT)
            || (isRTL && cameraPosition === CAMERADOCK_POSITION.CONTENT_LEFT)),
        },
        zIndex: cameraDockBounds.zIndex,
        focusedId: input.cameraDock.focusedId,
        isLocalOnly: isPhoneLandscape(input.browser) || isCameraDockUnmoved(),
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_DROP_AREAS,
      value: shiftedDropAreas,
    });

    layoutContextDispatch({
      type: ACTIONS.SET_PRESENTATION_OUTPUT,
      value: {
        display: presentationInput.isOpen,
        width: mediaBounds.width,
        height: mediaBounds.height,
        top: mediaBounds.top,
        left: shiftedMedia.left,
        right: shiftedMedia.right,
        tabOrder: DEFAULT_VALUES.presentationTabOrder,
        isResizable: false,
        zIndex: mediaBounds.zIndex,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_SCREEN_SHARE_OUTPUT,
      value: {
        width: mediaBounds.width,
        height: mediaBounds.height,
        top: mediaBounds.top,
        left: shiftedMedia.left,
        right: shiftedMedia.right,
        zIndex: mediaBounds.zIndex,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_EXTERNAL_VIDEO_OUTPUT,
      value: {
        display: externalVideoInput.hasExternalVideo,
        width: mediaBounds.width,
        height: mediaBounds.height,
        top: mediaBounds.top,
        left: shiftedMedia.left,
        right: shiftedMedia.right,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_GENERIC_CONTENT_OUTPUT,
      value: {
        width: mediaBounds.width,
        height: mediaBounds.height,
        top: mediaBounds.top,
        left: shiftedMedia.left,
        right: shiftedMedia.right,
      },
    });

    layoutContextDispatch({
      type: ACTIONS.SET_SHARED_NOTES_OUTPUT,
      value: {
        width: mediaBounds.width,
        height: mediaBounds.height,
        top: mediaBounds.top,
        left: shiftedMedia.left,
        right: shiftedMedia.right,
      },
    });
  };

  return null;
};

export default UnifiedLayout;
