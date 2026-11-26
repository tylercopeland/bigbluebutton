import styled from 'styled-components';
import { panelMutedText, panelText } from '/imports/ui/stylesheets/styled-components/palette';

const Grip = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 32px;
  margin-inline: -6px 2px;
  color: ${panelMutedText};
  cursor: grab;
`;

const Title = styled.h2`
  flex: 1;
  min-width: 0;
  margin: 0;
  padding-block: 8px;
  overflow: hidden;
  color: ${panelText};
  font-size: 1.05rem;
  font-weight: 700;
  line-height: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default { Grip, Title };
