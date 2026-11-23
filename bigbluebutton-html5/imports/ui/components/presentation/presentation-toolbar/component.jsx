import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import injectWbResizeEvent from '/imports/ui/components/presentation/resize-wrapper/component';
import Button from '/imports/ui/components/common/button/component';
import {
  HUNDRED_PERCENT,
  MAX_PERCENT,
  MIN_PERCENT,
  STEP,
} from '/imports/utils/slideCalcUtils';
import {
  PresentationToolbarItemType,
} from 'bigbluebutton-html-plugin-sdk/dist/cjs/extensible-areas/presentation-toolbar-item/enums';
import Styled, {
  COMPACT_ATTRIBUTE,
  OVERFLOWING_ATTRIBUTE,
  OUT_OF_ROOM_ATTRIBUTE,
} from './styles';
import SlidesOverview from './slides-overview/component';
import {
  GridIcon, MoreIcon, NextIcon, PreviousIcon,
} from './icons';
import ZoomTool from './zoom-tool/component';
import SmartMediaShareContainer from './smart-video-share/container';
import TooltipContainer from '/imports/ui/components/common/tooltip/container';
import KEYS from '/imports/utils/keys';
import Spinner from '/imports/ui/components/common/spinner/component';
import Separator from '/imports/ui/components/common/separator/component';

const FIT_TOLERANCE_PX = 1;

// Below this, the slide controls go above the whiteboard tools instead of next to them
const STACKED_MAX_WIDTH = 920;

const POPOVERS = {
  OVERVIEW: 'overview',
  MORE: 'more',
};

const exceedsAvailableWidth = (element) => (
  element.scrollWidth > element.clientWidth + FIT_TOLERANCE_PX
);

const intlMessages = defineMessages({
  allSlidesLabel: {
    id: 'app.presentation.allSlides.title',
    description: 'Title of the grid with every slide',
    defaultMessage: 'All slides',
  },
  slidesLabel: {
    id: 'app.presentation.presentationToolbar.slides',
    description: 'Accessible label for the slide controls',
    defaultMessage: 'Slides',
  },
  moreLabel: {
    id: 'app.presentation.presentationToolbar.more',
    description: 'Label for the button with zoom and whiteboard sharing controls',
    defaultMessage: 'Zoom and whiteboard controls',
  },
  previousSlideLabel: {
    id: 'app.presentation.presentationToolbar.prevSlideLabel',
    description: 'Previous slide button label',
  },
  previousSlideDesc: {
    id: 'app.presentation.presentationToolbar.prevSlideDesc',
    description: 'Aria description for when switching to previous slide',
  },
  nextSlideLabel: {
    id: 'app.presentation.presentationToolbar.nextSlideLabel',
    description: 'Next slide button label',
  },
  nextSlideDesc: {
    id: 'app.presentation.presentationToolbar.nextSlideDesc',
    description: 'Aria description for when switching to next slide',
  },
  noNextSlideDesc: {
    id: 'app.presentation.presentationToolbar.noNextSlideDesc',
    description: '',
  },
  noPrevSlideDesc: {
    id: 'app.presentation.presentationToolbar.noPrevSlideDesc',
    description: '',
  },
  skipSlideLabel: {
    id: 'app.presentation.presentationToolbar.skipSlideLabel',
    description: 'Aria label for when switching to a specific slide',
  },
  skipSlideDesc: {
    id: 'app.presentation.presentationToolbar.skipSlideDesc',
    description: 'Aria description for when switching to a specific slide',
  },
  goToSlide: {
    id: 'app.presentation.presentationToolbar.goToSlide',
    description: 'button for slide select',
  },
  selectLabel: {
    id: 'app.presentation.presentationToolbar.selectLabel',
    description: 'slide select label',
  },
  fitToWidth: {
    id: 'app.presentation.presentationToolbar.fitToWidth',
    description: 'button for fit to width',
  },
  fitToWidthDesc: {
    id: 'app.presentation.presentationToolbar.fitWidthDesc',
    description: 'Aria description to display the whole width of the slide',
  },
  fitToPage: {
    id: 'app.presentation.presentationToolbar.fitToPage',
    description: 'button label for fit to width',
  },
  fitToPageDesc: {
    id: 'app.presentation.presentationToolbar.fitScreenDesc',
    description: 'Aria description to display the whole slide',
  },
  presentationLabel: {
    id: 'app.presentationUploder.title',
    description: 'presentation area element label',
  },
  toolbarMultiUserOn: {
    id: 'app.whiteboard.toolbar.multiUserOn',
    description: 'Whiteboard toolbar turn multi-user on menu',
  },
  toolbarMultiUserOff: {
    id: 'app.whiteboard.toolbar.multiUserOff',
    description: 'Whiteboard toolbar turn multi-user off menu',
  },
  multiUserLimitHasBeenReached: {
    id: 'app.whiteboard.toolbar.multiUserLimitHasBeenReached',
    description: 'Whiteboard toolbar toggle multi-user disabled',
  },
  infiniteWhiteboardOn: {
    id: 'app.whiteboard.toolbar.infiniteWhiteboardOn',
    description: 'Whiteboard toolbar turn infinite wb on',
  },
  infiniteWhiteboardOff: {
    id: 'app.whiteboard.toolbar.infiniteWhiteboardOff',
    description: 'Whiteboard toolbar turn infinite wb off',
  },
  pan: {
    id: 'app.whiteboard.toolbar.tools.hand',
    description: 'presentation toolbar pan label',
  },
});

class PresentationToolbar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { openPopover: null };

    this.selectSlide = this.selectSlide.bind(this);
    this.closePopover = this.closePopover.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePopoverKeyDown = this.handlePopoverKeyDown.bind(this);
    this.handleSkipToSlideChange = this.handleSkipToSlideChange.bind(this);
    this.change = this.change.bind(this);
    this.renderAriaDescs = this.renderAriaDescs.bind(this);
    this.nextSlideHandler = this.nextSlideHandler.bind(this);
    this.previousSlideHandler = this.previousSlideHandler.bind(this);
    this.fullscreenToggleHandler = this.fullscreenToggleHandler.bind(this);
    this.switchSlide = this.switchSlide.bind(this);
    this.handleSwitchWhiteboardMode = this.handleSwitchWhiteboardMode.bind(this);
    this.updateToolbarFit = this.updateToolbarFit.bind(this);
    this.scheduleToolbarFit = this.scheduleToolbarFit.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.switchSlide);
    document.addEventListener('keydown', this.handlePopoverKeyDown);
    document.addEventListener('pointerdown', this.handlePointerDown, true);
    this.updateToolbarFit();
    this.observeWrapper();
  }

  componentDidUpdate(prevProps) {
    const { toolbarWidth, isOverlay, currentSlide } = this.props;

    if (prevProps.isOverlay !== isOverlay) this.observeWrapper();
    if (prevProps.isOverlay !== isOverlay
      || prevProps.currentSlide?.presentationId !== currentSlide?.presentationId) {
      this.closePopover();
    }

    if (prevProps.toolbarWidth !== toolbarWidth) this.updateToolbarFit();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.switchSlide);
    document.removeEventListener('keydown', this.handlePopoverKeyDown);
    document.removeEventListener('pointerdown', this.handlePointerDown, true);
    this.resizeObserver?.disconnect();
    if (this.toolbarFitFrame) window.cancelAnimationFrame(this.toolbarFitFrame);
  }

  handlePointerDown(event) {
    const { openPopover } = this.state;
    if (openPopover && !this.stageControls?.contains(event.target)) this.closePopover();
  }

  handlePopoverKeyDown(event) {
    const { openPopover } = this.state;
    if (openPopover && event.key === KEYS.ESCAPE) this.closePopover();
  }

  handleSkipToSlideChange(event) {
    const { skipToSlide, currentSlide } = this.props;
    const requestedSlideNum = Number.parseInt(event.target.value, 10);

    if (currentSlide?.infiniteWhiteboard) this.disableInfiniteWhiteboard();

    if (event) event.currentTarget.blur();
    skipToSlide(requestedSlideNum);
  }

  handleSwitchWhiteboardMode() {
    const {
      multiUser,
      setMultiUserWhiteboardDisabled,
      setMultiUserWhiteboardEnabled,
    } = this.props;
    if (multiUser) {
      return setMultiUserWhiteboardDisabled();
    }
    return setMultiUserWhiteboardEnabled();
  }

  observeWrapper() {
    this.resizeObserver?.disconnect();
    if (this.wrapper && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(this.scheduleToolbarFit);
      this.resizeObserver.observe(this.wrapper);
    }
  }

  togglePopover(popover) {
    this.setState(({ openPopover }) => ({
      openPopover: openPopover === popover ? null : popover,
    }));
  }

  closePopover() {
    this.setState({ openPopover: null });
  }

  selectSlide(slideNum) {
    const { skipToSlide, currentSlide } = this.props;

    if (currentSlide?.infiniteWhiteboard) this.disableInfiniteWhiteboard();
    skipToSlide(slideNum);
    this.closePopover();
  }

  scheduleToolbarFit() {
    if (this.toolbarFitFrame) return;

    this.toolbarFitFrame = window.requestAnimationFrame(() => {
      this.toolbarFitFrame = null;
      this.updateToolbarFit();
    });
  }

  updateToolbarFit() {
    const { wrapper } = this;

    if (!wrapper) return;

    wrapper.setAttribute(COMPACT_ATTRIBUTE, 'false');
    wrapper.setAttribute(OVERFLOWING_ATTRIBUTE, 'false');
    wrapper.setAttribute(OUT_OF_ROOM_ATTRIBUTE, 'false');

    const isCompact = exceedsAvailableWidth(wrapper);

    if (isCompact) this.keepFocusOutOfZoomTool();
    wrapper.setAttribute(COMPACT_ATTRIBUTE, isCompact.toString());

    wrapper.setAttribute(OVERFLOWING_ATTRIBUTE, exceedsAvailableWidth(wrapper).toString());
    wrapper.setAttribute(OUT_OF_ROOM_ATTRIBUTE, exceedsAvailableWidth(wrapper).toString());
  }

  keepFocusOutOfZoomTool() {
    const { zoomToolWrapper, fitToWidthButton } = this;

    if (!zoomToolWrapper?.contains(document.activeElement)) return;

    fitToWidthButton?.focus();
  }

  disableInfiniteWhiteboard() {
    const {
      tldrawAPI, resetSlide, zoomChanger, setPresentationPageInfiniteWhiteboard,
    } = this.props;

    tldrawAPI?.setCamera({ x: 0, y: 0 });
    resetSlide();
    zoomChanger(100);
    setPresentationPageInfiniteWhiteboard(false);
  }

  fullscreenToggleHandler() {
    const {
      fullscreenElementId,
      isFullscreen,
      layoutContextDispatch,
      fullscreenAction,
      fullscreenRef,
      handleToggleFullScreen,
    } = this.props;

    handleToggleFullScreen(fullscreenRef);
    const newElement = isFullscreen ? '' : fullscreenElementId;

    layoutContextDispatch({
      type: fullscreenAction,
      value: {
        element: newElement,
        group: '',
      },
    });
  }

  nextSlideHandler(event) {
    const { nextSlide, currentSlide } = this.props;

    if (currentSlide?.infiniteWhiteboard) this.disableInfiniteWhiteboard();

    if (event) event.currentTarget.blur();
    nextSlide();
  }

  previousSlideHandler(event) {
    const { previousSlide, currentSlide } = this.props;

    if (currentSlide?.infiniteWhiteboard) this.disableInfiniteWhiteboard();

    if (event) event.currentTarget.blur();
    previousSlide();
  }

  switchSlide(event) {
    const { target, key } = event;
    const isBody = target.nodeName === 'BODY';
    const isWhiteboard = target.classList.contains('tl-container');

    if (key === KEYS.ENTER && (isWhiteboard || isBody)) {
      this.fullscreenToggleHandler();
      return;
    }

    if (isBody) {
      switch (key) {
        case KEYS.ARROW_LEFT:
        case KEYS.PAGE_UP:
          this.previousSlideHandler();
          break;
        case KEYS.ARROW_RIGHT:
        case KEYS.PAGE_DOWN:
          this.nextSlideHandler();
          break;
        default:
      }
    }
  }

  change(value) {
    const { zoomChanger } = this.props;
    zoomChanger(value);
  }

  renderToolbarPluginItems() {
    let pluginProvidedItems = [];
    if (this.props) {
      const {
        pluginProvidedPresentationToolbarItems,
      } = this.props;
      pluginProvidedItems = pluginProvidedPresentationToolbarItems;
    }

    return pluginProvidedItems?.map((ppb) => {
      let componentToReturn;
      const ppbId = ppb.id;

      switch (ppb.type) {
        case PresentationToolbarItemType.BUTTON:
          componentToReturn = (
            <Button
              key={ppbId}
              style={{ marginLeft: '2px', ...ppb.style }}
              label={ppb.label}
              color={ppb.color || 'default'}
              circle={ppb.circle === true}
              hideLabel={ppb.hideLabel === true}
              size={ppb.size || 'md'}
              onClick={ppb.onClick}
              tooltipLabel={ppb.tooltip}
              dataTest={ppb.dataTest}
            />
          );
          break;
        case PresentationToolbarItemType.SPINNER:
          componentToReturn = (
            <Spinner
              key={ppbId}
            />
          );
          break;
        case PresentationToolbarItemType.SEPARATOR:
          componentToReturn = (
            <Separator />
          );
          break;
        default:
          componentToReturn = null;
      }
      return componentToReturn;
    });
  }

  renderAriaDescs() {
    const { intl } = this.props;
    return (
      <div hidden>
        {/* Aria description's for toolbar buttons */}
        <div id="prevSlideDesc">
          {intl.formatMessage(intlMessages.previousSlideDesc)}
        </div>
        <div id="noPrevSlideDesc">
          {intl.formatMessage(intlMessages.noPrevSlideDesc)}
        </div>
        <div id="nextSlideDesc">
          {intl.formatMessage(intlMessages.nextSlideDesc)}
        </div>
        <div id="noNextSlideDesc">
          {intl.formatMessage(intlMessages.noNextSlideDesc)}
        </div>
        <div id="skipSlideDesc">
          {intl.formatMessage(intlMessages.skipSlideDesc)}
        </div>
        <div id="fitWidthDesc">
          {intl.formatMessage(intlMessages.fitToWidthDesc)}
        </div>
        <div id="fitPageDesc">
          {intl.formatMessage(intlMessages.fitToPageDesc)}
        </div>
      </div>
    );
  }

  renderSkipSlideOpts(numberOfSlides) {
    // Fill drop down menu with all the slides in presentation
    const { intl } = this.props;
    const optionList = [];
    for (let i = 1; i <= numberOfSlides; i += 1) {
      optionList.push(
        <option value={i} key={i}>
          {intl.formatMessage(intlMessages.goToSlide, { slideNumber: i })}
        </option>,
      );
    }

    return optionList;
  }

  render() {
    const {
      currentSlideNum,
      numberOfSlides,
      fitToWidthHandler,
      fitToWidth,
      intl,
      zoom,
      isConnected,
      isPollingEnabled,
      amIPresenter,
      startPoll,
      currentSlide,
      slidePosition,
      meetingIsBreakout,
      multiUserSize,
      multiUser,
      setPresentationPageInfiniteWhiteboard,
      allowInfiniteWhiteboard,
      allowInfiniteWhiteboardInBreakouts,
      infiniteWhiteboardIcon,
      maxNumberOfActiveUsers,
      numberOfJoinedUsers,
      isMobile,
      toolbarWidth,
      slideHeight,
      isOverlay,
      currentPresentationPage,
    } = this.props;
    const { openPopover } = this.state;

    const startOfSlides = !(currentSlideNum > 1);
    const endOfSlides = !(currentSlideNum < numberOfSlides);

    const prevSlideAriaLabel = startOfSlides
      ? intl.formatMessage(intlMessages.previousSlideLabel)
      : `${intl.formatMessage(intlMessages.previousSlideLabel)} (${currentSlideNum <= 1 ? '' : currentSlideNum - 1
      })`;

    const nextSlideAriaLabel = endOfSlides
      ? intl.formatMessage(intlMessages.nextSlideLabel)
      : `${intl.formatMessage(intlMessages.nextSlideLabel)} (${currentSlideNum >= 1 ? currentSlideNum + 1 : ''
      })`;

    const isInfiniteWhiteboard = currentSlide?.infiniteWhiteboard;

    const showIWB = (allowInfiniteWhiteboard && !meetingIsBreakout)
      || (meetingIsBreakout && allowInfiniteWhiteboardInBreakouts);

    const multiUserLimitExceeded = numberOfJoinedUsers > maxNumberOfActiveUsers;
    const disableStartingMultiUser = !multiUser && multiUserLimitExceeded;
    let multiUserLabel;
    if (disableStartingMultiUser) {
      multiUserLabel = intl.formatMessage(
        intlMessages.multiUserLimitHasBeenReached,
        { numberOfUsers: maxNumberOfActiveUsers },
      );
    } else if (multiUser) {
      multiUserLabel = intl.formatMessage(intlMessages.toolbarMultiUserOff);
    } else {
      multiUserLabel = intl.formatMessage(intlMessages.toolbarMultiUserOn);
    }

    const zoomControls = (
      <Styled.PresentationZoomControls className="bbb-presentation-toolbar__zoom-controls">
        {(showIWB) && (
        <Styled.InfiniteWhiteboardButton
          data-test={isInfiniteWhiteboard ? 'turnInfiniteWhiteboardOff' : 'turnInfiniteWhiteboardOn'}
          role="button"
          aria-label={
            isInfiniteWhiteboard
              ? intl.formatMessage(intlMessages.infiniteWhiteboardOff)
              : intl.formatMessage(intlMessages.infiniteWhiteboardOn)
          }
          color="light"
          disabled={!isConnected}
          customIcon={infiniteWhiteboardIcon(isInfiniteWhiteboard)}
          size="md"
          circle
          onClick={() => {
            if (isInfiniteWhiteboard) {
              this.disableInfiniteWhiteboard();
            } else {
              setPresentationPageInfiniteWhiteboard(true);
            }
          }}
          label={
            isInfiniteWhiteboard
              ? intl.formatMessage(intlMessages.infiniteWhiteboardOff)
              : intl.formatMessage(intlMessages.infiniteWhiteboardOn)
          }
          hideLabel
        />
        )}

        <Styled.WBAccessButton
          data-test={multiUser ? 'turnMultiUsersWhiteboardOff' : 'turnMultiUsersWhiteboardOn'}
          role="button"
          aria-label={multiUserLabel}
          color="light"
          disabled={disableStartingMultiUser}
          icon="multi_whiteboard"
          size="md"
          circle
          onClick={() => this.handleSwitchWhiteboardMode(!multiUser)}
          label={multiUserLabel}
          hideLabel
          $active={multiUser}
        />
        {multiUser ? (
          <Styled.MultiUserTool
            onClick={() => this.handleSwitchWhiteboardMode(!multiUser)}
          >
            {multiUserSize}
          </Styled.MultiUserTool>
        ) : (
          <Styled.MUTPlaceholder />
        )}
        {!isMobile ? (
          <Styled.ZoomToolWrapper
            ref={(ref) => { this.zoomToolWrapper = ref; }}
          >
            <TooltipContainer>
              <ZoomTool
                slidePosition={slidePosition}
                zoomValue={zoom}
                currentSlideNum={currentSlideNum}
                change={this.change}
                minBound={isInfiniteWhiteboard ? MIN_PERCENT : HUNDRED_PERCENT}
                maxBound={MAX_PERCENT}
                step={STEP}
                isInfiniteWhiteboard={isInfiniteWhiteboard}
                isConnected={isConnected}
              />
            </TooltipContainer>
          </Styled.ZoomToolWrapper>
        ) : null}
        <Styled.FitToWidthButton
          setRef={(ref) => { this.fitToWidthButton = ref; }}
          role="button"
          data-test="fitToWidthButton"
          aria-describedby={fitToWidth ? 'fitPageDesc' : 'fitWidthDesc'}
          aria-label={
            fitToWidth
              ? `${intl.formatMessage(
                intlMessages.presentationLabel,
              )} ${intl.formatMessage(intlMessages.fitToPage)}`
              : `${intl.formatMessage(
                intlMessages.presentationLabel,
              )} ${intl.formatMessage(intlMessages.fitToWidth)}`
          }
          color="light"
          disabled={!isConnected}
          icon="fit_to_width"
          size="md"
          circle
          onClick={fitToWidthHandler}
          label={fitToWidth
            ? intl.formatMessage(intlMessages.fitToPage)
            : intl.formatMessage(intlMessages.fitToWidth)}
          hideLabel
          $fitToWidth={fitToWidth}
        />
      </Styled.PresentationZoomControls>
    );

    const quickActions = (
      <>
        {this.renderToolbarPluginItems()}
        {isPollingEnabled ? (
          <Styled.QuickPollButton
            {...{
              intl,
              amIPresenter,
              startPoll,
              currentSlide,
            }}
          />
        ) : null}

        <SmartMediaShareContainer {...{ intl, currentSlide }} />
      </>
    );

    const slideSelect = (
      <Styled.SkipSlideSelect
        id="skipSlide"
        aria-label={intl.formatMessage(intlMessages.skipSlideLabel)}
        aria-describedby="skipSlideDesc"
        aria-live="polite"
        aria-relevant="all"
        disabled={!isConnected}
        value={currentSlideNum}
        onChange={this.handleSkipToSlideChange}
        data-test="skipSlide"
      >
        {this.renderSkipSlideOpts(numberOfSlides)}
      </Styled.SkipSlideSelect>
    );

    if (isOverlay) {
      return (
        <Styled.StageControls
          className="bbb-presentation-toolbar bbb-stage-control"
          id="presentationToolbarWrapper"
          data-overlay="true"
          data-stacked={toolbarWidth < STACKED_MAX_WIDTH}
          ref={(ref) => { this.stageControls = ref; }}
          style={{
            '--slide-width': `${toolbarWidth}px`,
            '--stage-popover-max-height': `${Math.max(slideHeight - (toolbarWidth < STACKED_MAX_WIDTH ? 142 : 88), 160)}px`,
          }}
        >
          {this.renderAriaDescs()}
          <Styled.StageStack>
            {openPopover === POPOVERS.OVERVIEW && (
              <SlidesOverview
                presentationId={currentSlide.presentationId}
                presentationName={currentPresentationPage.presentationName}
                currentSlideNum={currentSlideNum}
                numberOfSlides={numberOfSlides}
                onSelect={this.selectSlide}
                onClose={this.closePopover}
              />
            )}
            {openPopover === POPOVERS.MORE && (
              <Styled.StageMorePanel
                role="group"
                aria-label={intl.formatMessage(intlMessages.moreLabel)}
                data-test="presentationMorePanel"
              >
                {zoomControls}
              </Styled.StageMorePanel>
            )}
            {openPopover === null && <Styled.StageExtras>{quickActions}</Styled.StageExtras>}
            <Styled.StagePill
              role="group"
              aria-label={intl.formatMessage(intlMessages.slidesLabel)}
              className="bbb-presentation-toolbar__slide-controls"
            >
              <TooltipContainer title={intl.formatMessage(intlMessages.allSlidesLabel)}>
                <Styled.StageButton
                  type="button"
                  aria-label={intl.formatMessage(intlMessages.allSlidesLabel)}
                  aria-expanded={openPopover === POPOVERS.OVERVIEW}
                  disabled={!isConnected}
                  onClick={() => this.togglePopover(POPOVERS.OVERVIEW)}
                  data-test="allSlides"
                >
                  <GridIcon />
                </Styled.StageButton>
              </TooltipContainer>
              <Styled.StageDivider />
              <TooltipContainer title={intl.formatMessage(intlMessages.previousSlideLabel)}>
                <Styled.StageButton
                  type="button"
                  $isDirectional
                  aria-label={prevSlideAriaLabel}
                  aria-describedby={startOfSlides ? 'noPrevSlideDesc' : 'prevSlideDesc'}
                  disabled={startOfSlides || !isConnected}
                  onClick={this.previousSlideHandler}
                  data-test="prevSlide"
                >
                  <PreviousIcon />
                </Styled.StageButton>
              </TooltipContainer>
              <Styled.StagePosition>
                <span aria-hidden="true" dir="ltr">{`${currentSlideNum} / ${numberOfSlides}`}</span>
                {slideSelect}
              </Styled.StagePosition>
              <TooltipContainer title={intl.formatMessage(intlMessages.nextSlideLabel)}>
                <Styled.StageButton
                  type="button"
                  $isPrimary
                  $isDirectional
                  aria-label={nextSlideAriaLabel}
                  aria-describedby={endOfSlides ? 'noNextSlideDesc' : 'nextSlideDesc'}
                  disabled={endOfSlides || !isConnected}
                  onClick={this.nextSlideHandler}
                  data-test="nextSlide"
                >
                  <NextIcon />
                </Styled.StageButton>
              </TooltipContainer>
              <Styled.StageDivider />
              <TooltipContainer title={intl.formatMessage(intlMessages.moreLabel)}>
                <Styled.StageButton
                  type="button"
                  aria-label={intl.formatMessage(intlMessages.moreLabel)}
                  aria-expanded={openPopover === POPOVERS.MORE}
                  onClick={() => this.togglePopover(POPOVERS.MORE)}
                  data-test="presentationMoreControls"
                >
                  <MoreIcon />
                  {multiUser && <Styled.StageDot />}
                </Styled.StageButton>
              </TooltipContainer>
            </Styled.StagePill>
          </Styled.StageStack>
        </Styled.StageControls>
      );
    }

    return (
      <Styled.PresentationToolbarWrapper
        className="bbb-presentation-toolbar"
        id="presentationToolbarWrapper"
        ref={(ref) => { this.wrapper = ref; }}
        style={{ '--slide-width': `${toolbarWidth}px` }}
      >
        {this.renderAriaDescs()}
        <Styled.QuickPollButtonWrapper>
          {quickActions}
        </Styled.QuickPollButtonWrapper>
        <Styled.PresentationSlideControls className="bbb-presentation-toolbar__slide-controls">
          <Styled.PrevSlideButton
            role="button"
            aria-label={prevSlideAriaLabel}
            aria-describedby={
              startOfSlides ? 'noPrevSlideDesc' : 'prevSlideDesc'
            }
            disabled={startOfSlides || !isConnected}
            color="light"
            circle
            icon="left_arrow"
            size="md"
            onClick={this.previousSlideHandler}
            label={intl.formatMessage(intlMessages.previousSlideLabel)}
            hideLabel
            data-test="prevSlide"
          />

          <TooltipContainer
            title={intl.formatMessage(intlMessages.selectLabel)}
          >
            {slideSelect}
          </TooltipContainer>
          <Styled.NextSlideButton
            role="button"
            aria-label={nextSlideAriaLabel}
            aria-describedby={
              endOfSlides ? 'noNextSlideDesc' : 'nextSlideDesc'
            }
            disabled={endOfSlides || !isConnected}
            color="light"
            circle
            icon="right_arrow"
            size="md"
            onClick={this.nextSlideHandler}
            label={intl.formatMessage(intlMessages.nextSlideLabel)}
            hideLabel
            data-test="nextSlide"
          />
        </Styled.PresentationSlideControls>
        {zoomControls}
      </Styled.PresentationToolbarWrapper>
    );
  }
}

PresentationToolbar.propTypes = {
  // Number of current slide being displayed
  currentSlideNum: PropTypes.number.isRequired,
  // Total number of slides in this presentation
  numberOfSlides: PropTypes.number.isRequired,
  // Actions required for the presenter toolbar
  nextSlide: PropTypes.func.isRequired,
  previousSlide: PropTypes.func.isRequired,
  skipToSlide: PropTypes.func.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  zoomChanger: PropTypes.func.isRequired,
  fitToWidthHandler: PropTypes.func.isRequired,
  fitToWidth: PropTypes.bool.isRequired,
  zoom: PropTypes.number.isRequired,
  isConnected: PropTypes.bool.isRequired,
  fullscreenElementId: PropTypes.string.isRequired,
  fullscreenAction: PropTypes.string.isRequired,
  isFullscreen: PropTypes.bool.isRequired,
  layoutContextDispatch: PropTypes.func.isRequired,
  multiUser: PropTypes.bool.isRequired,
  setMultiUserWhiteboardDisabled: PropTypes.func.isRequired,
  setMultiUserWhiteboardEnabled: PropTypes.func.isRequired,
  fullscreenRef: PropTypes.instanceOf(Element),
  handleToggleFullScreen: PropTypes.func.isRequired,
  isPollingEnabled: PropTypes.bool.isRequired,
  amIPresenter: PropTypes.bool.isRequired,
  startPoll: PropTypes.func.isRequired,
  currentSlide: PropTypes.shape().isRequired,
  slidePosition: PropTypes.shape().isRequired,
  multiUserSize: PropTypes.number.isRequired,
  maxNumberOfActiveUsers: PropTypes.number.isRequired,
  numberOfJoinedUsers: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired,
  toolbarWidth: PropTypes.number,
  slideHeight: PropTypes.number,
  isOverlay: PropTypes.bool,
  currentPresentationPage: PropTypes.shape({
    presentationName: PropTypes.string,
  }),
};

PresentationToolbar.defaultProps = {
  fullscreenRef: null,
  toolbarWidth: 0,
  slideHeight: 0,
  isOverlay: false,
  currentPresentationPage: {},
};

export default injectWbResizeEvent(injectIntl(PresentationToolbar));
