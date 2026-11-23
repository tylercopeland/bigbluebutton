import styled from 'styled-components';
import { colorPrimary, colorWhite } from '/imports/ui/stylesheets/styled-components/palette';

// Main action of a Share media tab.
const TrayButton = styled.button`
  flex-shrink: 0;
  min-height: 38px;
  padding: 0 16px;
  border: 0;
  border-radius: 10px;
  background-color: ${colorPrimary};
  color: ${colorWhite};
  font-family: inherit;
  font-size: .85rem;
  font-weight: 700;
  cursor: pointer;

  &:hover:not(:disabled) {
    filter: brightness(90%);
  }

  &:focus-visible {
    outline: 2px solid ${colorPrimary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: .45;
    cursor: not-allowed;
  }
`;

export default TrayButton;
