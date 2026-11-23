import styled from 'styled-components';
import {
  colorPrimary,
  colorWhite,
  panelMutedText,
  panelRowHoverBg,
  panelText,
  stageControlBorder,
  stageControlColor,
  roomFocusRing,
} from '/imports/ui/stylesheets/styled-components/palette';

const Overview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 664px;
  max-width: 100%;
  max-height: var(--stage-popover-max-height);
  box-sizing: border-box;
  padding: 14px;
  border: 1px solid ${stageControlBorder};
  border-radius: 16px;
  background-color: ${colorWhite};
  box-shadow: 0 18px 44px rgba(15, 23, 36, .28);
`;

const Header = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  padding: 0 2px;
`;

const Title = styled.span`
  font-size: .9375rem;
  font-weight: 700;
  color: ${panelText};
`;

const Details = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: .8125rem;
  color: ${panelMutedText};
`;

const Close = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: ${stageControlColor};
  cursor: pointer;

  &:hover {
    background-color: ${panelRowHoverBg};
  }

  &:focus-visible {
    outline: 2px solid ${roomFocusRing};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  min-height: 0;
  margin: -3px;
  padding: 3px;
  overflow-y: auto;
`;

const Slide = styled.button`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  font-family: inherit;
  text-align: start;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${roomFocusRing};
    outline-offset: 1px;
  }
`;

const Thumbnail = styled.span<{ $isCurrent: boolean }>`
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 8px;
  border: ${({ $isCurrent }) => ($isCurrent ? `2.5px solid ${colorPrimary}` : `1px solid ${stageControlBorder}`)};
  background-color: ${colorWhite};

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const Caption = styled.span`
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: .75rem;
`;

const Number = styled.span<{ $isCurrent: boolean }>`
  font-weight: 700;
  color: ${({ $isCurrent }) => ($isCurrent ? colorPrimary : panelMutedText)};
`;

const SlideTitle = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${stageControlColor};
`;

export default {
  Overview,
  Header,
  Title,
  Details,
  Close,
  Grid,
  Slide,
  Thumbnail,
  Caption,
  Number,
  SlideTitle,
};
