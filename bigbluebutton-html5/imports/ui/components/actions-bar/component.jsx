import React, { PureComponent } from 'react';
import { defineMessages } from 'react-intl';
import { ActionsBarItemType, ActionsBarPosition } from 'bigbluebutton-html-plugin-sdk/dist/cjs/extensible-areas/actions-bar-item/enums';
import Styled from './styles';
import MediaAreaContainer from './media-area/container';
import { PluginButtonIcon } from '/imports/ui/components/plugins/plugin-icon/styles';
import AudioCaptionsButtonContainer from '/imports/ui/components/audio/audio-graphql/audio-captions/button/component';
import ScreenshareButtonContainer from '/imports/ui/components/actions-bar/screenshare/container';
import AudioControlsContainer from '../audio/audio-graphql/audio-controls/component';
import JoinVideoOptionsContainer from '../video-provider/video-button/container';
import PresentationOptionsContainer from './presentation-options/component';
import SwapPresentationButton from './swap-presentation/component';
import Button from '/imports/ui/components/common/button/component';
import { LAYOUT_TYPE } from '../layout/enums';
import ReactionsButtonContainer from '/imports/ui/components/actions-bar/reactions-button/container';
import RaiseHandButtonContainer from '/imports/ui/components/actions-bar/raise-hand-button/container';
import Selector from '/imports/ui/components/common/selector/component';
import ToggleGroup from '/imports/ui/components/common/toggle-group/component';
import Separator from '/imports/ui/components/common/separator/component';
import NavigationDock from '/imports/ui/components/sidebar-navigation/dock/component';
import LeaveMeetingButtonContainer from '/imports/ui/components/nav-bar/leave-meeting-button/container';
import deviceInfo from '/imports/utils/deviceInfo';

const intlMessages = defineMessages({
  actionsBarLabel: {
    id: 'app.actionsBar.label',
    description: 'Aria-label for ActionsBar Section',
  },
});

// Below this bar width (px) the docked controls shrink to fit
const DOCK_COMPACT_WIDTH = 720;

class ActionsBar extends PureComponent {
  constructor(props) {
    super(props);

    this.actionsBarRef = React.createRef();
    this.renderPluginsActionBarItems = this.renderPluginsActionBarItems.bind(this);
  }

  renderPluginsActionBarItems(position) {
    const { actionBarItems } = this.props;
    return (
      <>
        {
          actionBarItems.filter((plugin) => plugin.position === position).map((plugin) => {
            let actionBarItemToReturn;
            let buttonProps;
            switch (plugin.type) {
              case ActionsBarItemType.BUTTON:
                buttonProps = {
                  key: `${plugin.type}-${plugin.id}`,
                  onClick: plugin.onClick,
                  hideLabel: plugin.hideLabel !== false,
                  color: plugin.color || 'primary',
                  size: deviceInfo.isMobile ? 'md' : (plugin.size || 'lg'),
                  circle: deviceInfo.isMobile ? true : (plugin.circle !== false),
                  style: plugin.style,
                  label: plugin.label || plugin.tooltip,
                  tooltipLabel: plugin.tooltip,
                  dataTest: plugin.dataTest,
                };
                if (typeof plugin?.icon === 'string') {
                  buttonProps.icon = plugin.icon;
                } else if (plugin?.icon && typeof plugin.icon === 'object' && 'iconName' in plugin.icon) {
                  buttonProps.icon = plugin.icon.iconName;
                } else if (plugin?.icon && typeof plugin.icon === 'object' && 'svgContent' in plugin.icon) {
                  buttonProps.customIcon = (
                    <PluginButtonIcon>
                      {plugin.icon.svgContent}
                    </PluginButtonIcon>
                  );
                }
                actionBarItemToReturn = (
                  <Button
                    {
                    ...buttonProps
                    }
                  />
                );
                break;
              case ActionsBarItemType.SEPARATOR:
                actionBarItemToReturn = (
                  <Separator
                    key={`${plugin.type}-${plugin.id}`}
                    actionsBar
                    icon={plugin.icon}
                    dataTest={plugin.dataTest}
                  />
                );
                break;
              case ActionsBarItemType.SELECTOR:
                actionBarItemToReturn = (
                  <Selector
                    title={plugin.title}
                    options={plugin.options}
                    defaultOption={plugin.defaultOption}
                    onChange={plugin.onChange}
                    width={plugin.width}
                    dataTest={plugin.dataTest}
                  />
                );
                break;
              case ActionsBarItemType.TOGGLE_GROUP:
                actionBarItemToReturn = (
                  <ToggleGroup
                    title={plugin.title}
                    options={plugin.options}
                    defaultOption={plugin.defaultOption}
                    onChange={plugin.onChange}
                    exclusive={plugin.exclusive}
                    dataTest={plugin.dataTest}
                  />
                );
                break;
              default:
                actionBarItemToReturn = null;
                break;
            }
            return actionBarItemToReturn;
          })
        }
      </>
    );
  }

  renderMediaArea() {
    const {
      amIPresenter,
      amIModerator,
      intl,
      isSharingVideo,
      hasCameraAsContent,
      stopExternalVideoShare,
      isTimerActive,
      isTimerEnabled,
      isConnected,
      isPollingEnabled,
      isThereCurrentPresentation,
      allowExternalVideo,
      presentationIsOpen,
      setPresentationFitToWidth,
    } = this.props;

    return (
      <MediaAreaContainer {...{
        amIPresenter,
        amIModerator,
        isPollingEnabled,
        allowExternalVideo,
        intl,
        isSharingVideo,
        stopExternalVideoShare,
        isTimerActive,
        isTimerEnabled,
        isConnected,
        presentationIsOpen,
        hasCameraAsContent,
        setPresentationFitToWidth,
        hasPresentation: isThereCurrentPresentation,
      }}
      />
    );
  }

  renderReactionsButton() {
    return (
      <>
        <ReactionsButtonContainer actionsBarRef={this.actionsBarRef} />
      </>
    );
  }

  render() {
    const {
      amIPresenter,
      amIModerator,
      enableVideo,
      presentationIsOpen,
      setPresentationIsOpen,
      intl,
      isSharingVideo,
      isNavigationDocked,
      isDirectLeaveButtonEnabled,
      isSharedNotesPinned,
      hasScreenshare,
      hasGenericContent,
      hasCameraAsContent,
      isConnected,
      isThereCurrentPresentation,
      layoutContextDispatch,
      actionsBarStyle,
      isPresentationEnabled,
      ariaHidden,
      isDarkThemeEnabled,
      isMobile,
      showScreenshareQuickSwapButton,
      isReactionsButtonEnabled,
      isRaiseHandEnabled,
      selectedLayout,
    } = this.props;

    const shouldShowPresentationButton = selectedLayout !== LAYOUT_TYPE.CAMERAS_ONLY
      && selectedLayout !== LAYOUT_TYPE.PARTICIPANTS_AND_CHAT_ONLY;
    const shouldShowVideoButton = selectedLayout !== LAYOUT_TYPE.PRESENTATION_ONLY
      && selectedLayout !== LAYOUT_TYPE.PARTICIPANTS_AND_CHAT_ONLY;
    const shouldRenderActionBar = selectedLayout !== LAYOUT_TYPE.PLUGINS_ONLY;

    const shouldShowOptionsButton = (isPresentationEnabled && isThereCurrentPresentation)
      || isSharingVideo || hasScreenshare || isSharedNotesPinned;

    return shouldRenderActionBar && (
      <Styled.ActionsBarWrapper
        className="bbb-actions-bar"
        $isCompact={isNavigationDocked && actionsBarStyle.width < DOCK_COMPACT_WIDTH}
        id="ActionsBar"
        role="region"
        aria-label={intl.formatMessage(intlMessages.actionsBarLabel)}
        aria-hidden={ariaHidden}
        style={
          {
            position: 'absolute',
            top: actionsBarStyle.top,
            left: actionsBarStyle.left,
            height: actionsBarStyle.height,
            width: actionsBarStyle.width,
            padding: isNavigationDocked
              ? `${actionsBarStyle.padding}px 0`
              : actionsBarStyle.padding,
            ...(isMobile && { overflowX: 'auto' }),
            ...(isMobile && { overflowY: 'hidden' }),
          }
        }
      >
        <h2 className="sr-only">{intl.formatMessage(intlMessages.actionsBarLabel)}</h2>
        <Styled.ActionsBar
          ref={this.actionsBarRef}
          style={
            {
              height: actionsBarStyle.innerHeight,
            }
          }
        >
          <Styled.Left className="bbb-actions-bar__left">
            {isNavigationDocked && <NavigationDock section="start" />}
            {this.renderPluginsActionBarItems(ActionsBarPosition.LEFT)}
            <AudioCaptionsButtonContainer />

          </Styled.Left>
          <Styled.Center className="bbb-actions-bar__center">
            <AudioControlsContainer />
            {shouldShowVideoButton && enableVideo
              ? (
                <JoinVideoOptionsContainer />
              )
              : null}
            {isNavigationDocked && this.renderMediaArea()}
            {!isNavigationDocked && shouldShowPresentationButton && (
              <ScreenshareButtonContainer {...{
                amIPresenter,
                isConnected,
              }}
              />
            )}
            {isReactionsButtonEnabled && this.renderReactionsButton()}
            {isRaiseHandEnabled && <RaiseHandButtonContainer />}
            {this.renderPluginsActionBarItems(ActionsBarPosition.RIGHT)}
          </Styled.Center>
          <Styled.Right className="bbb-actions-bar__right">
            <Styled.PresentationButtonsWrapper
              className="bbb-actions-bar__media-buttons"
              $isDocked={isNavigationDocked}
            >
              {shouldShowPresentationButton && shouldShowOptionsButton
                && (
                  <PresentationOptionsContainer
                    presentationIsOpen={presentationIsOpen}
                    setPresentationIsOpen={setPresentationIsOpen}
                    layoutContextDispatch={layoutContextDispatch}
                    hasPresentation={isThereCurrentPresentation}
                    hasExternalVideo={isSharingVideo}
                    hasScreenshare={hasScreenshare}
                    hasPinnedSharedNotes={isSharedNotesPinned}
                    hasGenericContent={hasGenericContent}
                    hasCameraAsContent={hasCameraAsContent}
                    isDarkThemeEnabled={isDarkThemeEnabled}
                  />
                )}
              {!isNavigationDocked && ((amIPresenter || amIModerator)
                && shouldShowOptionsButton) && (<Styled.Divider />)}
              {!isNavigationDocked && this.renderMediaArea()}
            </Styled.PresentationButtonsWrapper>
            <Styled.Gap>
              {
                showScreenshareQuickSwapButton && <SwapPresentationButton />
              }
            </Styled.Gap>
            {isNavigationDocked && <NavigationDock section="end" />}
            {isNavigationDocked && isDirectLeaveButtonEnabled && isConnected
              && <LeaveMeetingButtonContainer amIModerator={amIModerator} isDocked />}
          </Styled.Right>
        </Styled.ActionsBar>
      </Styled.ActionsBarWrapper>
    );
  }
}

export default ActionsBar;
