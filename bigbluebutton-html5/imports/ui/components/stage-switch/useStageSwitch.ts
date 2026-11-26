import useMeeting from '/imports/ui/core/hooks/useMeeting';
import useCurrentUser from '/imports/ui/core/hooks/useCurrentUser';
import usePresentationSwap from '/imports/ui/core/hooks/usePresentationSwap';
import useDeduplicatedSubscription from '/imports/ui/core/hooks/useDeduplicatedSubscription';
import {
  CURRENT_PRESENTATION_PAGE_SUBSCRIPTION,
  CurrentPresentationPageSubscriptionResponse,
} from '/imports/ui/components/whiteboard/queries';
import useIsNavigationDocked from '/imports/ui/components/sidebar-navigation/hooks/useIsNavigationDocked';
import { layoutSelect } from '/imports/ui/components/layout/context';
import { Layout } from '/imports/ui/components/layout/layoutTypes';
import { DEVICE_TYPE } from '/imports/ui/components/layout/enums';

/**
 * The presenter's switch between their shared screen (or camera) and their
 * slides. It sets the meeting's "screenshare as content" flag, which everyone's
 * stage follows, so the share keeps running while everyone sees the slides.
 */
const useStageSwitch = () => {
  const { data: meeting } = useMeeting((m) => ({ componentsFlags: m.componentsFlags }));
  const { data: currentUser } = useCurrentUser((u) => ({ presenter: u.presenter }));
  const [isScreenOnStage, setScreenOnStage] = usePresentationSwap();
  const isDocked = useIsNavigationDocked();
  const deviceType = layoutSelect((i: Layout) => i.deviceType);
  const fullscreenElement = layoutSelect((i: Layout) => i.fullscreen.element);

  const flags = meeting?.componentsFlags;
  const isCamera = !!flags?.hasCameraAsContent;
  const isSharing = !!flags?.hasScreenshare || isCamera;
  const isPresenter = !!currentUser?.presenter;

  const { data: pageData } = useDeduplicatedSubscription<CurrentPresentationPageSubscriptionResponse>(
    CURRENT_PRESENTATION_PAGE_SUBSCRIPTION,
    { skip: !isPresenter || !isSharing },
  );
  const page = pageData?.pres_page_curr?.[0];

  // Notes, an external video or a plugin take the stage over, and there is
  // nothing to switch to without slides
  const isStageTakenOver = !!flags?.isSharedNotesPinned || !!flags?.hasExternalVideo;

  const isVisible = isDocked
    && deviceType !== DEVICE_TYPE.MOBILE
    && isPresenter
    && isSharing
    && !!page
    && !isStageTakenOver
    && !fullscreenElement;

  return {
    isVisible,
    isScreenOnStage,
    setScreenOnStage,
    isCamera,
    slide: page?.num ?? 0,
    totalSlides: page?.totalPages ?? 0,
  };
};

export default useStageSwitch;
