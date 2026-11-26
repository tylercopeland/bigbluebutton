import styled from 'styled-components';
import {
  colorPrimary,
  panelBorder,
  panelTabsBg,
} from '/imports/ui/stylesheets/styled-components/palette';

// Not a box of its own until it is stacked, so that panels keep their layout and
// stay mounted when they are detached or combined
const StackItem = styled.section<{ $isStacked: boolean; $share: number }>`
  display: contents;

  ${({ $isStacked, $share }) => $isStacked && `
    position: relative;
    display: flex;
    flex: ${$share} 1 0;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  `}
`;

const Divider = styled.div`
  position: relative;
  flex-shrink: 0;
  height: 8px;
  border-block: 1px solid ${panelBorder};
  background-color: ${panelTabsBg};
  cursor: ns-resize;
  touch-action: none;

  &::after {
    content: '';
    position: absolute;
    inset-block-start: 2px;
    left: 50%;
    width: 28px;
    height: 2px;
    margin-left: -14px;
    border-radius: 1px;
    background-color: ${panelBorder};
  }

  &:hover::after,
  &:focus-visible::after {
    background-color: ${colorPrimary};
  }

  &:focus-visible {
    outline: 2px solid ${colorPrimary};
    outline-offset: -2px;
  }
`;

export default { StackItem, Divider };
