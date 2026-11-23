import { layoutSelect, layoutSelectInput } from '/imports/ui/components/layout/context';
import { Input, Layout } from '/imports/ui/components/layout/layoutTypes';
import { DEVICE_TYPE, LAYOUT_TYPE } from '/imports/ui/components/layout/enums';
import useSettings from '/imports/ui/services/settings/hooks/useSettings';
import { SETTINGS } from '/imports/ui/services/settings/enums';

// When docked, the navigation buttons live in the actions bar and there is no
// left rail. Phones and layouts without a visible actions bar keep the rail,
// so its buttons are always reachable.
const useIsNavigationDocked = (): boolean => {
  const deviceType = layoutSelect((i: Layout) => i.deviceType);
  const layoutType = layoutSelect((i: Layout) => i.layoutType);
  const actionBar = layoutSelectInput((i: Input) => i.actionBar);
  const { hideActionsBar, hideControls } = useSettings(SETTINGS.APPLICATION) as {
    hideActionsBar: boolean;
    hideControls: boolean;
  };

  return deviceType !== DEVICE_TYPE.MOBILE
    && layoutType === LAYOUT_TYPE.UNIFIED_LAYOUT
    && !!actionBar?.hasActionBar
    && !hideActionsBar
    && !hideControls;
};

export default useIsNavigationDocked;
