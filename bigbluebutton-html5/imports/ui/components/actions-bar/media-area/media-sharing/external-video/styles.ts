import styled from 'styled-components';
import {
  colorDanger,
  colorPrimary,
  colorWhite,
  panelBorder,
  panelMutedText,
  panelText,
} from '/imports/ui/stylesheets/styled-components/palette';
import TrayButton from '../tray-button/styles';

const Content = styled.div`
  padding: 0 1.5rem 1.5rem 1.5rem;

  #standard-basic-helper-text {
    margin-bottom: 0px;
  }
`;

const NoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const TrayForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 4px 2px;
  text-align: start;
`;

const TrayLabel = styled.label`
  margin: 0;
  color: ${panelText};
  font-size: .8rem;
  font-weight: 700;
`;

const TrayInput = styled.input<{ $hasError: boolean }>`
  height: 38px;
  padding: 0 12px;
  border: 1.5px solid ${({ $hasError }) => ($hasError ? colorDanger : panelBorder)};
  border-radius: 10px;
  background-color: ${colorWhite};
  color: ${panelText};
  font-family: inherit;
  font-size: .875rem;

  &::placeholder {
    color: ${panelMutedText};
  }

  &:focus {
    outline: 2px solid ${colorPrimary};
    outline-offset: -1px;
  }
`;

const TrayRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TrayNote = styled.span<{ $hasError: boolean }>`
  flex: 1;
  color: ${({ $hasError }) => ($hasError ? colorDanger : panelMutedText)};
  font-size: .8rem;
`;

export default {
  TrayForm,
  TrayLabel,
  TrayInput,
  TrayRow,
  TrayNote,
  TrayButton,
  Content,
  NoteContainer,
};
