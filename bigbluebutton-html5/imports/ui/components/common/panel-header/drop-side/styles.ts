import styled from 'styled-components';
import {
  colorPrimary,
  colorWhite,
} from '/imports/ui/stylesheets/styled-components/palette';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
  cursor: grabbing;
`;

const Target = styled.div<{ $isNewSide: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 16px;
  border: 3px dashed ${colorPrimary};
  color: ${colorWhite};
  font-weight: 700;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background-color: ${colorPrimary};
    opacity: ${({ $isNewSide }) => ($isNewSide ? 0.6 : 0.12)};
  }
`;

export default { Overlay, Target };
