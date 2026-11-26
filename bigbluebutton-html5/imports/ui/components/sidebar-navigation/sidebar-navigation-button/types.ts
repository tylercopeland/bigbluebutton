import { ReactNode } from 'react';
import { PANELS } from '/imports/ui/components/layout/enums';
import { PluginIconType } from 'bigbluebutton-html-plugin-sdk';

export interface SidebarNavigationButtonProps {
  panel?: typeof PANELS[keyof typeof PANELS];
  isOpened?: boolean;
  iconName: PluginIconType;
  label: string;
  hasNotification?: boolean;
  hasPrivateNotification?: boolean;
  isDisabled?: boolean;
  isLocked?: boolean;
  accessKey?: string;
  dataTest?: string;
  id?: string;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onToggle?: (isOpening: boolean) => void;
  children?: ReactNode;
  ariaDescribedBy?: string;
  /** A number shown on the button while docked, like raised hands or unread messages */
  badgeCount?: number;
  badgeTone?: 'hand' | 'unread';
  /** Read after the label by screen readers while the badge shows */
  badgeLabel?: string;
}

export interface ListItemProps {
  $active?: boolean;
  $hasNotification?: boolean;
  $hasPrivateNotification?: boolean;
  $disabled?: boolean;
  $locked?: boolean;
  $hasBadge?: boolean;
}
