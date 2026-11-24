import styled, { css } from 'styled-components';
import ButtonWrappers from '/imports/ui/components/common/button-wrapper/styles';
import { BBBHint } from '@bigbluebutton/bbb-ui-components-react/Hint';
import { BBBTextInput } from '@bigbluebutton/bbb-ui-components-react/TextInput';
import PollTextArea from './components/PollTextArea';
import {
  Separator as BaseSeparator,
  PanelContent as BasePanelContent,
} from '/imports/ui/components/sidebar-content/styles';
import {
  jumboPaddingY,
  lgPaddingX,
  borderSize,
  pollInputHeight,
  mdPaddingX,
  smPadding,
  contentSidebarPadding,
  contentSidebarBottomScrollPadding,
  lgBorderRadius,
  borderSizeSmall,
  lgPadding,
  $2xlPadding,
} from '/imports/ui/stylesheets/styled-components/general';
import {
  colorText,
  colorBorder,
  colorGrayLighter,
  colorDanger,
  colorWarning,
  colorPrimary,
  colorGrayDark,
  colorWhite,
  darkCyanLime,
  colorInfoBoxQuizBg,
  colorInfoBoxQuizText,
  colorSelectedCorrectAnswerText,
  colorSelectedCorrectAnswerBg,
  colorSelectedCorrectAnswerTextActive,
  colorSelectedCorrectAnswerBgActive,
  colorGreen600,
  colorGreen100,
  panelBorder,
  panelLive,
  panelLiveText,
  panelMutedText,
  panelRowActionColor,
  panelRowHoverBg,
  panelTabActiveColor,
  panelTabColor,
  panelTabsBg,
  panelText,
  stageControlActiveBg,
  stageControlBorder,
} from '/imports/ui/stylesheets/styled-components/palette';
import {
  fontSizeBase,
  fontSizeSmall,
  fontSizeSmaller,
  lineHeightComputed,
  textFontWeight,
} from '/imports/ui/stylesheets/styled-components/typography';
import { ScrollboxVertical } from '/imports/ui/stylesheets/styled-components/scrollable';

// Design spec for the text inside every poll button. The library's button hardcodes
// font-weight 600 and line-height normal, so both are restated wherever one is styled.
// font-family is deliberately left alone: the spec asks for Nunito Sans, which this app
// does not ship - it bundles Source Sans Pro only - so naming it here would just fall
// through to a fallback face and look worse than the app's own font.
const pollButtonText = css`
  font-size: ${fontSizeBase};
  font-weight: ${textFontWeight};
  line-height: 1;
  letter-spacing: 0;
`;

const Separator = styled(BaseSeparator)``;

const PanelContent = styled(BasePanelContent)``;

type PollOptionInputProps = {
  $isCorrect?: boolean;
};

// The library's text input renders a MUI field, and the class lands on the field root,
// so the poll's own box - sizing, border and the quiz highlight - is applied to
// `.MuiInputBase-root`, which is the element that actually draws it.
const PollOptionInput = styled(BBBTextInput)<PollOptionInputProps>`
  // No explicit width: the library's wrapper is a column flex, so the field stretches to
  // it on its own - pinning it to 100% would make the margin below overflow instead.
  margin-right: 1rem;

  [dir="rtl"] & {
      margin-right: 0;
      margin-left: 1rem;
  }

  .MuiInputBase-root {
    min-height: var(--panel-control-height, ${pollInputHeight});
    height: var(--panel-control-height, auto);
    color: ${colorText};
    padding: 0 var(--panel-inset, ${$2xlPadding});
    border-radius: ${lgBorderRadius};
    font-size: ${fontSizeBase};
    border: ${borderSizeSmall} solid ${colorBorder};

    &.Mui-focused {
      box-shadow: 0 0 0 ${borderSize} ${colorPrimary}, inset 0 0 0 ${borderSizeSmall} ${colorPrimary};
    }

    ${({ $isCorrect }) => $isCorrect && `
      background-color: ${colorGreen100};
      border-color: ${colorGreen600};
    `}
  }
`;
const DeletePollOptionButton = styled.div`
  display: flex;
  flex: none;
  margin-left: ${lgPadding};

  [dir="rtl"] & {
    margin-right: ${lgPadding};
    margin-left: 0;
  }

  & > button {
    width: var(--panel-control-height, ${pollInputHeight});
    min-height: var(--panel-control-height, ${pollInputHeight});
    height: var(--panel-control-height, auto);
    border-radius: ${lgBorderRadius};
    font-size: ${fontSizeBase};
  }
`;

const ErrorSpacer = styled.div`
  position: relative;
  height: var(--panel-gap, 1.25rem);
`;

const InputError = styled(ErrorSpacer)`
  height: auto;
  color: ${colorDanger};
  font-size: ${fontSizeSmall};
`;

type PollQuestionAreaProps = {
  $hasError?: boolean;
};

// Wraps the library's textarea. The doubled selector (&&) is what makes these rules win:
// both sides are a single class on the same element, so specificity alone would tie and
// the result would depend on stylesheet order.
const PollQuestionArea = styled(PollTextArea)<PollQuestionAreaProps>`
  && {
    resize: none;
    width: 100%;
    margin: 0;
    color: ${colorText};
    -webkit-appearance: none;
    padding: var(--panel-inset, ${$2xlPadding}) var(--panel-inset, ${jumboPaddingY});
    border-radius: ${lgBorderRadius};
    font-size: ${fontSizeBase};
    line-height: ${lineHeightComputed};
    border: ${borderSizeSmall} solid ${colorBorder};
    // The library caps its textarea and hides the overflow; the poll question holds up
    // to 1200 characters, so it has to be able to grow and then scroll.
    max-height: none;
    overflow-y: auto;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 ${borderSize} ${colorPrimary}, inset 0 0 0 ${borderSizeSmall} ${colorPrimary};
    }

    ${({ $hasError }) => $hasError && `
      border-color: ${colorDanger};
      box-shadow: 0 0 0 ${borderSizeSmall} ${colorDanger};
    `}
  }
`;

const PollQuestionAreaWrapper = styled.div`
  margin-bottom: var(--panel-inset, ${$2xlPadding});
`;

const SectionHeading = styled.h4`
  margin-top: 0;
  margin-bottom: ${lgPadding};
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: ${panelMutedText};
`;

const ResponseType = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  width: 100%;
  margin-bottom: var(--panel-inset, ${$2xlPadding});
`;

// One wrapper per response type. The library states its colours with &&:hover:not(...)
// and paints the label span directly, which outranks any selector reachable from here, so
// the chip's own colours need !important.
const ResponseTypeButton = styled.div<{ $selected: boolean }>`
  display: flex;
  max-width: 100%;

  & > button {
    min-height: 30px;
    padding: 0 11px;
    border-radius: 15px;
    border: 1px solid ${({ $selected }) => ($selected ? colorPrimary : panelBorder)} !important;
    background-color: ${({ $selected }) => ($selected ? stageControlActiveBg : colorWhite)} !important;
    font-size: .85rem;
  }

  & > button,
  & > button span {
    font-weight: 600;
    color: ${({ $selected }) => ($selected ? colorPrimary : panelRowActionColor)} !important;
  }

  & > button:hover {
    background-color: ${({ $selected }) => ($selected ? stageControlActiveBg : panelRowHoverBg)} !important;
  }
`;

const PollParagraph = styled.div`
  color: ${colorText};
  margin-bottom: 0.9rem;
`;

const PollCheckbox = styled.div`
  display: block;
  margin-bottom: var(--panel-inset, ${$2xlPadding});
`;

const AddItemButton = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  & > button {
    gap: ${lgPadding};
    white-space: pre-wrap;
    text-decoration: underline;
    ${pollButtonText}
  }
`;

const Row = styled.div`
  display: flex;
  flex-flow: wrap;
  flex-grow: 1;
  justify-content: space-between;
  margin-top: var(--panel-row-margin, 0.7rem);
  margin-bottom: var(--panel-row-margin, 0.7rem);
`;

const Warning = styled.div`
  color: ${colorWarning};
  font-size: ${fontSizeSmall};
`;

const CustomInputRow = styled.div`
  display: flex;
  flex-flow: nowrap;
  flex-grow: 1;
  justify-content: space-between;
  margin-bottom: var(--panel-inset, ${$2xlPadding});
`;

const PollFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  padding: var(--panel-gap, ${$2xlPadding}) var(--panel-inset, ${jumboPaddingY});
  border-top: ${borderSizeSmall} solid ${colorBorder};
  background-color: ${colorWhite};

  // The running-poll actions render nothing until their subscription resolves; without
  // this the footer would flash as an empty bordered bar.
  &:empty {
    display: none;
  }
`;

// Start and Cancel share one row and one width, the way the timer panel pairs its own two
// actions. Both keep the library's own sizing so they stay identical; the white fill and
// the plain (not underlined) label come from the `secondary` variant at the call site.
const PollActionsRow = styled.div`
  display: flex;

  button {
    min-height: var(--panel-control-height, 44px);
    height: var(--panel-control-height, auto);
    border-radius: 12px;
  }

  width: 100%;
  gap: var(--panel-gap, ${$2xlPadding});

  & > * {
    flex: 1;
  }
`;

const CancelPollBtn = styled.div`
  display: flex;

  & > button {
    width: 100%;
  }
`;

const NoSlidePanelContainer = styled.div`
  color: ${colorGrayDark};
  text-align: center;
`;

const DragAndDropPollContainer = styled.div`
  width: 200px !important;
  height: 200px !important;
`;

const Question = styled.div`
  margin-bottom: ${lgPaddingX};
`;

const OptionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ResponseArea = styled.div`
  display: flex;
  flex-flow: column wrap;
`;

const AnonymousRow = styled(Row)`
  flex-flow: nowrap;
  width: 100%;
  margin-bottom: var(--panel-inset, ${$2xlPadding});
`;

const ResultLeft = styled.td`
  padding: 0 .5rem 0 0;
  border-bottom: 1px solid ${colorBorder};

  [dir="rtl"] & {
    padding: 0 0 0 .5rem;
  }
  padding-bottom: .25rem;
  word-break: break-all;
`;

const ResultRight = styled.td`
  padding-bottom: .25rem;
  padding-right: 0.5rem;
  word-break: break-all;
`;

const LiveStatus = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
  padding: 12px 14px;
  border-radius: 12px;
  background-color: ${panelRowHoverBg};
`;

const LiveStatusText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${panelLiveText};
  font-size: .8rem;
  font-weight: 700;

  &::before {
    content: '';
    flex-shrink: 0;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: ${panelLive};
  }
`;

const Track = styled.div<{ $height: number }>`
  height: ${({ $height }) => $height}px;
  overflow: hidden;
  border-radius: ${({ $height }) => $height / 2}px;
  background-color: ${stageControlBorder};
`;

const Fill = styled.div<{ $color: string; $animations: boolean }>`
  height: 100%;
  border-radius: inherit;
  background-color: ${({ $color }) => $color};
  ${({ $animations }) => $animations && 'transition: width .6s cubic-bezier(.2, .8, .2, 1);'}
`;

const Title = styled.div`
  margin-bottom: 14px;
  color: ${panelText};
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.3;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
`;

const Results = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0 0 14px;
  padding: 0;
  list-style: none;
`;

const ResultHeader = styled.div<{ $leading: boolean }>`
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
  color: ${panelText};
  font-size: .95rem;
  font-weight: ${({ $leading }) => ($leading ? 700 : 400)};
`;

const ResultLabel = styled.bdi`
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
`;

const ResultCount = styled.span<{ $leading: boolean }>`
  flex-shrink: 0;
  color: ${panelMutedText};
  font-weight: 400;

  b {
    color: ${({ $leading }) => ($leading ? colorPrimary : panelRowActionColor)};
  }
`;

const Note = styled.p`
  margin: 0 0 14px;
  color: ${panelMutedText};
  font-size: .8rem;
`;

const LiveResultActionsRow = styled.div`
  display: flex;
  gap: ${lgPadding};
  width: 100%;

  & > button {
    min-height: var(--panel-control-height, 44px);
    height: var(--panel-control-height, auto);
    border-radius: 12px;
    overflow-wrap: anywhere;
    white-space: normal;
  }

  & > button:first-child {
    flex: 1 1 0;
  }
`;

const StartPollButtonWrapper = styled(ButtonWrappers.FullWidthButtonWrapper)`
  width: 100%;
`;

const THeading = styled.th`
  text-align: left;

  [dir="rtl"] & {
    text-align: right;
  }
`;

// Layered on top of PollQuestionArea via its `as` prop, so it only adds the drop
// highlight; && for the same reason PollQuestionArea needs it.
const DndTextArea = styled(PollTextArea)<{ $active: boolean }>`
  && {
    background: ${({ $active }) => ($active ? colorGrayLighter : colorWhite)};
  }
`;

const ContentWrapper = styled(ScrollboxVertical)`
  // ScrollboxVertical paints scroll shadows as radial-gradients on its background. The
  // panel is meant to read flat, so they are dropped here rather than in the shared
  // component, which every other panel still relies on.
  background: none;
  margin: 0 var(--panel-scroll-margin, ${smPadding});
  padding: ${contentSidebarPadding} var(--panel-inset, ${jumboPaddingY}) ${contentSidebarBottomScrollPadding};
  flex: 1 1 auto;
  // Lets the box shrink below its content height so the footer stays pinned
  min-height: 0;
`;

const CorrectAnswerCheckbox = styled.input`
  width: 1.5rem;
  height: 1.5rem;
`;

const SegmentedButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: var(--panel-inset, ${mdPaddingX});
`;

const SegmentedButtonContainer = styled.div`
  display: flex;
  flex: 1;
  padding: 3px;
  border-radius: 10px;
  background-color: ${panelTabsBg};
`;

interface TabSelectorButtonProps {
  active?: boolean;
}

const SegmentedButton = styled.button<TabSelectorButtonProps>`
  flex: 1;
  height: 32px;
  border: 0;
  border-radius: 7px;
  background-color: ${({ active }) => (active ? colorWhite : 'transparent')};
  color: ${({ active }) => (active ? panelTabActiveColor : panelTabColor)};
  ${({ active }) => active && 'box-shadow: 0 1px 3px rgba(15, 23, 36, .14);'}
  font-family: inherit;
  font-size: .85rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    color: ${panelTabActiveColor};
  }

  &:focus-visible {
    outline: 2px solid ${colorPrimary};
    outline-offset: 1px;
  }
`;

const ShowCorrectAnswerLabel = styled.label`
  font-size: ${fontSizeSmall};
  font-weight: bolder;
  display: flex;
  align-items: center;
  font-size: ${fontSizeSmall};
  margin-bottom: 1rem;

  & > * {
    margin: 0 .5rem 0 0;

    [dir="rtl"] & {
      margin: 0 0 0 .5rem;
    }
  }
`;

const LiveResultTable = styled.table`
  width: 100%;
  color: ${panelText};
  font-size: .85rem;

  th,
  td {
    padding: 6px 0;
    border-bottom: 1px solid ${stageControlBorder};
  }
`;

const QuizCorrectAnswerCheckbox = styled.input`  
  --accent: ${darkCyanLime};
  --inputMask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="3" stroke="%23000" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path d="M5 12l5 5l10 -10"/></svg>');
  
  appearance: none;
  aspect-ratio: 1;
  background: var(--backgroundColor, Field);
  border: 1px solid var(--borderColor, ${colorBorder});
  border-radius: 50%;
  box-sizing: border-box;
  font-size: 1em;
  height: ${lgPaddingX};
  margin: .1875em .1875em .1875em .25em;
  position: relative;
  width: ${lgPaddingX};
  margin-right: ${mdPaddingX};

  &::after {
    background: var(--backgroundColorAfter, transparent);
    content: "";
    inset: 0;
    position: absolute;
    mask: var(--inputMask) no-repeat center / contain;
    -webkit-mask: var(--inputMask) no-repeat center / contain;
  }

  &:checked {
    --backgroundColor: var(--accent);
    --backgroundColorAfter: Field;
  }

  @media (hover: hover) {
    &:checked:hover {
      --backgroundColor: color-mix(in srgb, var(--accent) 60%, CanvasText 40%);
    }
    &:not(:checked):hover {
      --borderColor: color-mix(in srgb, GrayText 60%, CanvasText 40%);
    }
  }
`;

type InfoBoxContainerProps = {
  isQuiz: boolean;
};

const InfoBoxContainer = styled.div<InfoBoxContainerProps>`
  padding: 10px 12px;
  border-radius: 10px;
  margin-bottom: 1rem;
  font-size: .8rem;
  color: ${panelMutedText};
  background-color: ${panelRowHoverBg};

  p {
    margin: 0;
  }

  ${({ isQuiz }) => isQuiz && `
    background-color: ${colorInfoBoxQuizBg};
    color: ${colorInfoBoxQuizText};
  `}
`;

const TypedResponseHint = styled(BBBHint)`
  margin-bottom: var(--panel-inset, ${$2xlPadding});
`;

const ResponseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

type SelectedCorrectAnswerIndicatorProps = {
  hasCorrectAnswer: boolean;
};

const SelectedCorrectAnswerIndicator = styled.span<SelectedCorrectAnswerIndicatorProps>`
  color: ${colorSelectedCorrectAnswerText};
  line-height: 1.25rem;
  padding: 0.25rem 0.50rem;
  background-color: ${colorSelectedCorrectAnswerBg};
  border-radius: 9999px;

  ${({ hasCorrectAnswer }) => hasCorrectAnswer && `
    color: ${colorSelectedCorrectAnswerTextActive};
    background-color: ${colorSelectedCorrectAnswerBgActive};
  `}
`;

const CorrectLabel = styled.div`
  position: absolute;
  top: 50%;
  right: 2rem;
  transform:  translate(0, -50%);
  border-radius: 9999px; 
  color: ${colorGreen600};
  background-color: ${colorGreen100};
  padding: 0.25rem 0.50rem;
  font-size: ${fontSizeSmaller};
  line-height: ${lineHeightComputed};
`;

const PollInputContainer = styled.div`
  display: flex;
  flex: 1 1 0%;
  position: relative;
`;

export default {
  Separator,
  PanelContent,
  PollOptionInput,
  DeletePollOptionButton,
  ErrorSpacer,
  InputError,
  PollQuestionArea,
  SectionHeading,
  ResponseType,
  ResponseTypeButton,
  PollParagraph,
  PollCheckbox,
  AddItemButton,
  Row,
  StartPollButtonWrapper,
  PollFooter,
  PollActionsRow,
  CancelPollBtn,
  LiveResultActionsRow,
  NoSlidePanelContainer,
  DragAndDropPollContainer,
  Warning,
  CustomInputRow,
  Question,
  OptionWrapper,
  ResponseArea,
  AnonymousRow,
  ResultLeft,
  ResultRight,
  Title,
  LiveStatus,
  LiveStatusText,
  Track,
  Fill,
  Results,
  ResultHeader,
  ResultLabel,
  ResultCount,
  Note,
  THeading,
  DndTextArea,
  ContentWrapper,
  CorrectAnswerCheckbox,
  SegmentedButtonContainer,
  ShowCorrectAnswerLabel,
  LiveResultTable,
  SegmentedButtonWrapper,
  SegmentedButton,
  QuizCorrectAnswerCheckbox,
  InfoBoxContainer,
  ResponseHeader,
  TypedResponseHint,
  SelectedCorrectAnswerIndicator,
  CorrectLabel,
  PollInputContainer,
  PollQuestionAreaWrapper,
};
