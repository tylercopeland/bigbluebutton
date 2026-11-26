import React, { useEffect, useRef, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { layoutSelectInput, layoutSelectOutput } from '/imports/ui/components/layout/context';
import { Input, Output } from '/imports/ui/components/layout/layoutTypes';
import { getMediaElement, screenshareHasEnded } from '/imports/ui/components/screenshare/service';
import KEYS from '/imports/utils/keys';
import useStageSwitch from './useStageSwitch';
import fitToSlide from './fitToSlide';
import Styled from './styles';

const intlMessages = defineMessages({
  label: {
    id: 'app.stageSwitch.label',
    description: 'Accessible name of the switch between slides and the shared screen',
    defaultMessage: 'What you\'re presenting',
  },
  presentation: {
    id: 'app.stageSwitch.presentation',
    description: 'Tab that shows the slides to everyone while the screen stays shared',
    defaultMessage: 'Presentation',
  },
  slideCount: {
    id: 'app.stageSwitch.slideCount',
    description: 'Accessible slide position on the Presentation tab',
    defaultMessage: 'slide {current} of {total}',
  },
  monitor: {
    id: 'app.stageSwitch.monitor',
    description: 'Tab for a shared entire screen',
    defaultMessage: 'Entire screen',
  },
  window: {
    id: 'app.stageSwitch.window',
    description: 'Tab for a shared window',
    defaultMessage: 'Window',
  },
  browser: {
    id: 'app.stageSwitch.browser',
    description: 'Tab for a shared browser tab',
    defaultMessage: 'Browser tab',
  },
  screen: {
    id: 'app.stageSwitch.screen',
    description: 'Tab for a shared screen, when the kind is unknown',
    defaultMessage: 'Screen',
  },
  camera: {
    id: 'app.stageSwitch.camera',
    description: 'Tab for a camera shared as content',
    defaultMessage: 'Camera',
  },
  everyoneSees: {
    id: 'app.stageSwitch.everyoneSees',
    description: 'Shown on the shared screen; the value is the tab name, like "entire screen"',
    defaultMessage: 'Everyone sees your {thing}',
  },
  everyoneSeesSlides: {
    id: 'app.stageSwitch.everyoneSeesSlides',
    description: 'Announced after switching to the slides',
    defaultMessage: 'Everyone sees your slides. Your screen is still shared.',
  },
  stop: {
    id: 'app.stageSwitch.stop',
    description: 'Stops the screen share',
    defaultMessage: 'Stop sharing',
  },
});

type Surface = 'monitor' | 'window' | 'browser' | 'screen';

// The kind of screen the browser shared. Only readable while the preview is on
// the stage, so it is remembered for when the slides are.
let lastSurface: Surface = 'screen';
const readSurface = (): Surface | null => {
  const media = getMediaElement() as HTMLVideoElement | null;
  const stream = media?.srcObject as MediaStream | null | undefined;
  const track = stream?.getVideoTracks?.()[0];
  const surface = (track?.getSettings() as { displaySurface?: string } | undefined)?.displaySurface;
  return surface === 'monitor' || surface === 'window' || surface === 'browser' ? surface : null;
};

const SlidesIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 4h18 M5 4v10h14V4 M12 14v3 M8 21l4-4 4 4" />
  </svg>
);

const StageSwitch: React.FC = () => {
  const intl = useIntl();
  const {
    isVisible, isScreenOnStage, setScreenOnStage, isCamera, slide, totalSlides,
  } = useStageSwitch();
  const presentation = layoutSelectOutput((i: Output) => i.presentation);
  const screenShare = layoutSelectOutput((i: Output) => i.screenShare);
  const slideSize = layoutSelectInput((i: Input) => i.presentation.currentSlide?.size);
  const [surface, setSurface] = useState<Surface>(lastSurface);
  const [announcement, setAnnouncement] = useState('');
  const tabsRef = useRef<HTMLDivElement>(null);
  const [previewBottom, setPreviewBottom] = useState<number | null>(null);

  // The live note sits right under the presenter's preview of their screen.
  // The video box is letterboxed, so the picture's own height is worked out.
  useEffect(() => {
    if (!isVisible || !isScreenOnStage) {
      setPreviewBottom(null);
      return undefined;
    }
    const measure = () => {
      const media = getMediaElement() as HTMLVideoElement | null;
      if (!media) { setPreviewBottom(null); return; }
      const box = media.getBoundingClientRect();
      const pictureHeight = media.videoWidth && media.videoHeight
        ? Math.min(box.height, box.width * (media.videoHeight / media.videoWidth))
        : box.height;
      setPreviewBottom(box.top + (box.height + pictureHeight) / 2);
    };
    measure();
    const timer = setInterval(measure, 500);
    return () => clearInterval(timer);
  }, [isVisible, isScreenOnStage, screenShare?.width, screenShare?.height, screenShare?.top]);

  // The preview mounts a moment after the share starts
  useEffect(() => {
    if (!isVisible || !isScreenOnStage || isCamera) return undefined;
    const check = () => {
      const found = readSurface();
      if (found) {
        lastSurface = found;
        setSurface(found);
      }
      return !!found;
    };
    if (check()) return undefined;
    const timer = setInterval(() => { if (check()) clearInterval(timer); }, 500);
    return () => clearInterval(timer);
  }, [isVisible, isScreenOnStage, isCamera]);

  useEffect(() => {
    if (!isVisible) lastSurface = 'screen';
  }, [isVisible]);

  if (!isVisible) return null;

  // Both sides use the slide's box, so the switch keeps its corner
  const stage = isScreenOnStage ? screenShare : fitToSlide(presentation, slideSize);
  if (!stage?.width || !stage?.height) return null;

  const thing = isCamera ? intl.formatMessage(intlMessages.camera) : intl.formatMessage(intlMessages[surface]);
  const select = (toScreen: boolean) => {
    if (toScreen === isScreenOnStage) return;
    setScreenOnStage(toScreen);
    setAnnouncement(toScreen
      ? intl.formatMessage(intlMessages.everyoneSees, { thing: thing.toLowerCase() })
      : intl.formatMessage(intlMessages.everyoneSeesSlides));
  };

  // Arrow keys move between the two tabs; Enter or Space picks one
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== KEYS.ARROW_LEFT && event.key !== KEYS.ARROW_RIGHT) return;
    event.preventDefault();
    const tabs = Array.from(tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []);
    const next = tabs.find((tab) => tab !== document.activeElement);
    next?.focus();
  };

  const presentationLabel = `${intl.formatMessage(intlMessages.presentation)}, ${
    intl.formatMessage(intlMessages.slideCount, { current: slide, total: totalSlides })}`;
  const left = stage.left ?? undefined;
  const right = left === undefined ? stage.right ?? undefined : undefined;
  const top = stage.top - 40;

  return (
    <>
      <Styled.TabList
        ref={tabsRef}
        role="tablist"
        aria-label={intl.formatMessage(intlMessages.label)}
        data-test="stageSwitch"
        style={{ top, left, right }}
        onKeyDown={handleKeyDown}
      >
        <Styled.Tab
          type="button"
          role="tab"
          aria-selected={!isScreenOnStage}
          tabIndex={isScreenOnStage ? -1 : 0}
          aria-label={presentationLabel}
          data-test="stageSwitchPresentation"
          onClick={() => select(false)}
        >
          <SlidesIcon />
          {intl.formatMessage(intlMessages.presentation)}
          <Styled.Count aria-hidden="true">{`${slide} / ${totalSlides}`}</Styled.Count>
        </Styled.Tab>
        <Styled.Tab
          type="button"
          role="tab"
          aria-selected={isScreenOnStage}
          tabIndex={isScreenOnStage ? 0 : -1}
          data-test="stageSwitchScreen"
          onClick={() => select(true)}
        >
          <Styled.LiveDot aria-hidden="true" />
          {thing}
        </Styled.Tab>
      </Styled.TabList>
      {isScreenOnStage && (
        <Styled.LivePill
          role="status"
          data-test="stageSwitchLive"
          style={{
            top: previewBottom !== null
              ? Math.min(previewBottom + 16, stage.top + stage.height - 56)
              : stage.top + stage.height - 56,
            left: (stage.left ?? (window.innerWidth - (stage.right ?? 0) - stage.width)) + stage.width / 2,
          }}
        >
          <Styled.LiveDot aria-hidden="true" />
          <span>{intl.formatMessage(intlMessages.everyoneSees, { thing: thing.toLowerCase() })}</span>
          <Styled.StopButton
            type="button"
            data-test="stageSwitchStop"
            onClick={() => screenshareHasEnded()}
          >
            {intl.formatMessage(intlMessages.stop)}
          </Styled.StopButton>
        </Styled.LivePill>
      )}
      <Styled.Announcer aria-live="polite">{announcement}</Styled.Announcer>
    </>
  );
};

export default StageSwitch;
