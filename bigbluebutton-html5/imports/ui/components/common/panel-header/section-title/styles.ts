import styled from 'styled-components';
import {
  colorPrimary,
  panelMutedText,
  panelSectionCount,
  panelSectionTitle,
  panelTabsBg,
} from '/imports/ui/stylesheets/styled-components/palette';

const Grip = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 32px;
  margin-inline: -8px 0;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: none;
  color: ${panelMutedText};
  cursor: grab;
  touch-action: none;

  &:hover {
    background-color: ${panelTabsBg};
  }

  &:focus-visible {
    outline: 2px solid ${colorPrimary};
    outline-offset: -2px;
  }
`;

// "PEOPLE 14"
const Title = styled.h2`
  display: flex;
  flex: 1;
  align-items: baseline;
  gap: 6px;
  min-width: 0;
  margin: 0;
  padding-block: 8px;
  overflow: hidden;
  color: ${panelSectionTitle};
  font-size: 14px;
  font-weight: 700;
  letter-spacing: .6px;
  line-height: normal;
  text-transform: uppercase;
  white-space: nowrap;
`;

const TitleText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Count = styled.span`
  flex-shrink: 0;
  color: ${panelSectionCount};
`;

export default {
  Grip, Title, TitleText, Count,
};
