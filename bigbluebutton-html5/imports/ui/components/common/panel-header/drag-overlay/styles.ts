import styled from 'styled-components';
import {
  colorPrimary,
  colorWhite,
  panelText,
} from '/imports/ui/stylesheets/styled-components/palette';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
  cursor: grabbing;
`;

const Area = styled.div<{ $isActive: boolean }>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 16px;
  border: 2px dashed ${colorPrimary};
  border-radius: 12px;
  color: ${colorWhite};
  font-weight: 700;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    background-color: ${colorPrimary};
    opacity: ${({ $isActive }) => ($isActive ? 0.85 : 0.12)};
  }
`;

const Label = styled.span<{ $isActive: boolean }>`
  padding: 6px 12px;
  border-radius: 999px;
  ${({ $isActive }) => !$isActive && `
    background-color: ${colorWhite};
    color: ${colorPrimary};
    box-shadow: 0 4px 14px rgba(15, 23, 36, .2);
  `}
`;

const Ghost = styled.div`
  position: absolute;
  padding: 8px 14px;
  border-radius: 10px;
  background-color: ${colorWhite};
  color: ${panelText};
  font-weight: 700;
  box-shadow: 0 10px 30px rgba(15, 23, 36, .35);
  pointer-events: none;
`;

export default {
  Overlay, Area, Label, Ghost,
};
