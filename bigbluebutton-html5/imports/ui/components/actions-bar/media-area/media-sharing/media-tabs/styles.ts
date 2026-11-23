import styled from 'styled-components';
import {
  colorPrimary,
  colorWhite,
  panelMutedText,
  panelRowActionColor,
  panelRowHoverBg,
  panelText,
  stageControlActiveBg,
  stageControlBorder,
} from '/imports/ui/stylesheets/styled-components/palette';

const Body = styled.div`
  max-height: min(60vh, 26rem);
  overflow-y: auto;
  padding: 12px 12px 10px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 4px;
  margin: 0 12px;
  padding: 10px 0 12px;
  border-top: 1px solid ${stageControlBorder};
`;

const TabTile = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  box-sizing: border-box;
  border: 1.5px solid ${stageControlBorder};
  border-radius: 12px;
  background-color: ${colorWhite};
`;

const Tab = styled.button<{ $selected: boolean }>`
  display: flex;
  flex: 1 1 0;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${panelRowActionColor};
  font-family: inherit;
  font-size: .75rem;
  font-weight: 600;
  line-height: 1.25;
  text-align: center;
  cursor: pointer;

  &:hover ${TabTile} {
    background-color: ${panelRowHoverBg};
  }

  &:focus-visible {
    outline: none;
  }

  &:focus-visible ${TabTile} {
    outline: 2px solid ${colorPrimary};
    outline-offset: 2px;
  }

  ${({ $selected }) => $selected && `
    color: ${colorPrimary};

    && ${TabTile} {
      border: 2px solid ${colorPrimary};
      background-color: ${stageControlActiveBg};
    }
  `}
`;

const Action = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 4px;
`;

const ActionIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: ${stageControlActiveBg};
  color: ${colorPrimary};
`;

const ActionText = styled.span`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
  color: ${panelText};
  font-size: .9rem;
  font-weight: 700;
  text-align: start;
`;

const ActionHint = styled.span`
  color: ${panelMutedText};
  font-size: .8rem;
  font-weight: 400;
`;

const Items = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  justify-items: center;
  gap: 8px;
`;

export default {
  Body,
  Tabs,
  Tab,
  TabTile,
  Action,
  ActionIcon,
  ActionText,
  ActionHint,
  Items,
};
