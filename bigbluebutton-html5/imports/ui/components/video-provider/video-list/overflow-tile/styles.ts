import styled from 'styled-components';
import {
  colorWhite,
  roomControlBg,
  roomFocusRing,
  webcamOverflowBorder,
} from '/imports/ui/stylesheets/styled-components/palette';

const OverflowTile = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-width: 100%;
  padding: 4px;
  border: 1px dashed ${webcamOverflowBorder};
  border-radius: 10px;
  background-color: transparent;
  color: ${colorWhite};
  font-family: inherit;
  font-size: .85rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background-color: ${roomControlBg};
  }

  &:focus-visible {
    outline: 2px solid ${roomFocusRing};
    outline-offset: -3px;
  }
`;

export default {
  OverflowTile,
};
