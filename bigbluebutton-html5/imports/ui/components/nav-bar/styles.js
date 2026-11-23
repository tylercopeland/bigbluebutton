import styled from 'styled-components';
import { barsPadding, mobileNavbarButtonGap, lgPadding } from '/imports/ui/stylesheets/styled-components/general';
import {
  colorWhite,
  colorBackground,
  colorGray,
} from '/imports/ui/stylesheets/styled-components/palette';
import { fontSizeBase, fontSizeSmall } from '/imports/ui/stylesheets/styled-components/typography';
import { phoneLandscape, smallOnly } from '/imports/ui/stylesheets/styled-components/breakpoints';

const Navbar = styled.header`
  position: absolute;
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: 1.5rem;
  background-color: ${colorBackground};
  padding: ${barsPadding} ${({ $isDocked }) => ($isDocked ? '0' : barsPadding)} 0;

  ${({ $isDocked }) => $isDocked && `
    justify-content: center;
    padding-top: 0;
  `}
`;

const Top = styled.div`
  display: flex;
  flex-direction: row;
`;

const ItemsGroup = `
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Left = styled.div`
  ${ItemsGroup}
  justify-content: flex-start;

  ${({ $isDocked }) => $isDocked && `
    flex: 1 1 auto;
    min-width: 0;
    gap: .65rem;

    & h1 {
      font-weight: 700;
      min-width: 0;
    }
  `}
`;

const Center = styled.div`
  ${ItemsGroup}
  justify-content: center;

  ${({ $isDocked }) => $isDocked && `
    /* Gives way before the title does */
    flex: 0 100 auto;
    min-width: 0;
  `}

  @media ${smallOnly} {
    min-width: 0;
  }
`;

const PresentationTitle = styled.h1`
  font-weight: 400;
  color: ${colorWhite};
  font-size: ${fontSizeBase};
  margin: 0;
  padding: 0;
  white-space: nowrap;
  overflow: hidden;
  max-width: 30vw;

  @media ${smallOnly} {
    min-width: 0;
    max-width: 100%;
    font-size: ${fontSizeSmall};
    padding: ${lgPadding};
  }
`;

const TitleButton = styled.button`
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  min-width: 0;

  &:focus-visible {
    outline: 2px solid ${colorWhite};
    border-radius: 2px;
  }

  > [class^="icon-bbb-"] {
    font-size: 75%;
    flex-shrink: 0;
  }

  @media ${smallOnly} {
    padding: 0 0.3rem;
  }
  & span i {
    margin-left: .5rem;
    margin-right: .5rem;
  }
`;

const TitleText = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PluginInfoComponent = styled.h1`
  font-weight: 400;
  color: ${colorWhite};
  font-size: ${fontSizeBase};
  margin: 0;
  padding: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 30vw;
`;

const PluginComponentWrapper = styled.div`
  margin: 0 .5rem;
`;

const PluginSeparatorWrapper = styled.div`
  color: ${colorGray};
  font-size: ${fontSizeBase};
  margin: 0 1rem;
`;

const Right = styled.div`
  ${ItemsGroup}
  justify-content: flex-end;
  ${({ $isDocked }) => $isDocked && 'flex: 0 0 auto;'}

  @media ${smallOnly} {
    gap: ${mobileNavbarButtonGap};
    padding-inline-start: ${mobileNavbarButtonGap};

    & > * {
      margin: 0 !important;
      padding: 0 !important;
      display: flex;
      align-items: center;
    }

    & > *:last-child {
      margin-inline-start: calc(-1 * ${mobileNavbarButtonGap}) !important;
    }
  }
`;

const Bottom = styled.div`
  display: flex;
  flex-direction: row;

  @media ${phoneLandscape} {
    margin-top: .25rem;
  }
`;

// Who is talking and the timer, in the middle of a docked bar
const InlineBottom = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 0 12px;
  overflow: hidden;

  /* These are spaced for a row of their own */
  .bbb-talking-indicator,
  .bbb-talking-indicator > *,
  .bbb-talking-indicator__item {
    margin-top: 0;
  }
`;

export default {
  Navbar,
  Top,
  Left,
  Center,
  PresentationTitle,
  TitleButton,
  TitleText,
  Right,
  Bottom,
  InlineBottom,
  PluginInfoComponent,
  PluginComponentWrapper,
  PluginSeparatorWrapper,
};
