import styled from 'styled-components';
import Dropzone from 'react-dropzone';
import Button from '/imports/ui/components/common/button/component';
import BackupIcon from '@mui/icons-material/BackupOutlined';
import {
  lgPaddingX,
  borderRadius,
} from '/imports/ui/stylesheets/styled-components/general';
import {
  fontSizeSmaller,
  textFontWeight,
} from '/imports/ui/stylesheets/styled-components/typography';
import {
  colorGrayLight,
  colorPrimary,
  colorDanger,
  colorLink,
  colorGrayLighter,
  colorText,
  colorOffWhite,
  colorGrayUserListToolbar,
  appsPanelTextColor,
  colorWhite,
  panelBorder,
  panelMutedText,
  panelRowActionColor,
  panelRowHoverBg,
  panelText,
  stageControlActiveBg,
  stageControlBorder,
} from '/imports/ui/stylesheets/styled-components/palette';

const UploadIcon = styled(BackupIcon)`
  color: ${colorPrimary};
  font-size: 2rem !important;
`;

const RemoveButton = styled(Button)`
  div > i {
    margin-top: .25rem;
  }

  &,
  & > i {
    display: inline-block;
    border: 0;
    background: transparent;
    cursor: pointer;
    font-size: 1.35rem;
    color: ${colorGrayLight};
    padding: 0;

    ${({ animations }) => animations && `
      transition: all .25s;
    `}

    :hover, :focus {
      padding: unset !important;
    }
  }

  background-color: transparent;
  border: 0 !important;

  & > i:focus,
  & > i:hover {
    color: ${colorDanger} !important;
  }

  &[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: .5;
    box-shadow: none;
    pointer-events: none;
  }
`;

const UploaderDropzone = styled(Dropzone)`
  display: flex;
  margin: 0 1.5rem;
  padding: 0.5rem 1.5rem;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex: 1 0 0;
  border-radius: 0.5rem;
  border: 1px dashed ${colorPrimary};
  cursor: pointer;

  &.dropzoneActive {
    background-color: ${colorGrayUserListToolbar};
  }
`;

const DropzoneMessage = styled.p`
  color: ${appsPanelTextColor};
  font-weight: ${textFontWeight};
  flex: 1 0 0;
`;

const DropzoneLink = styled.span`
  color: ${colorLink};
  text-decoration: underline;
`;

const ExtraHint = styled.div`
  margin: 1rem 1.5rem 0;
  font-weight: bold;
`;

const ExternalUpload = styled.div`
  background-color: ${colorOffWhite};
  border-radius: ${borderRadius};
  margin: 1rem;
  padding: ${lgPaddingX};
  color: ${colorText};
  font-weight: normal;
  display: flex;
  justify-content: space-between;
  flex-direction: row;

  & p {
    margin: 0;
  }
`;

const ExternalUploadTitle = styled.h4`
  font-size: 0.9rem;
  margin: 0;
`;

const ExternalUploadButton = styled(Button)`
  height: 2rem;
  align-self: center;
  margin-left: 2rem;
`;

const PresentationsContainer = styled.div`
  display: flex;
  padding-top: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1.5rem;
  align-items: stretch;
  gap: 1rem;
  align-self: stretch;
  flex-wrap: nowrap;
  overflow-x: auto;
`;

const PresentationItemContainer = styled.div`
  width: 10rem;
  max-height: 15rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  flex-shrink: 0;
`;

const PresentationThumbnail = styled.button`
  background: none;
  padding: 0;
  margin: 0;
  width: 100%;
  height: auto; // Adjust height based on image aspect ratio
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 0.5rem;
  overflow: hidden; // Ensures image respects border-radius
  border: 0.5px solid ${colorGrayLighter};

  &:hover,
  &:focus {
    outline: none;
    border: 2px solid ${colorPrimary};
  }

  ${({ selected }) => selected && `
    border: 2px solid ${colorPrimary};
  `}

  img {
    max-width: 100%;
    width: 100%;
    height: auto;
    object-fit: contain;
    display: block; // Remove extra space below image
  }
`;

const PresentationItemBottomContainer = styled.div`
  display: inline-flex;
  align-items: center;
  width: 100%;
  margin-top: auto;
`;

const PresentationItemName = styled.div`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  text-align: left;
  flex: 1 0 0;
  overflow: hidden;
  color: ${appsPanelTextColor};
  text-overflow: ellipsis;
  font-size: ${fontSizeSmaller};
  font-weight: ${textFontWeight};
`;

// Share media tray: the upload tile and the presentations share one grid
const TrayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`;

const TrayDropzone = styled(Dropzone)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 136px;
  padding: 6px;
  box-sizing: border-box;
  border: 1.5px dashed ${panelBorder};
  border-radius: 12px;
  background-color: ${colorWhite};
  color: ${panelRowActionColor};
  text-align: center;
  cursor: pointer;

  &:hover,
  &.dropzoneActive {
    background-color: ${panelRowHoverBg};
  }

  &:focus-visible {
    outline: 2px solid ${colorPrimary};
    outline-offset: 1px;
  }
`;

const TrayDropzoneTitle = styled.span`
  font-size: .85rem;
  font-weight: 700;
`;

const TrayDropzoneHint = styled.span`
  color: ${panelMutedText};
  font-size: .72rem;
`;

const TrayItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
  padding: 6px;
  box-sizing: border-box;
  border-radius: 12px;
  background-color: ${panelRowHoverBg};
  box-shadow: inset 0 0 0 1px ${stageControlBorder};

  ${({ $selected }) => $selected && `
    background-color: ${stageControlActiveBg};
    box-shadow: inset 0 0 0 2.5px ${colorPrimary};
  `}
`;

const TrayThumbnail = styled.button`
  display: block;
  width: 100%;
  height: 98px;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  border: 1px solid ${stageControlBorder};
  border-radius: 7px;
  background-color: ${colorWhite};
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${colorPrimary};
    outline-offset: 1px;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const TrayItemFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  min-height: 24px;

  /* The bar this tray opens from gives its buttons a round dark box */
  && button,
  &&& .buttonWrapper > .bbb-button__icon.bbb-button__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    min-width: 0;
    padding: 0;
    border: 0;
    background: transparent !important;
    box-shadow: none !important;
    color: ${panelRowActionColor} !important;
    filter: none !important;
  }

  && button i {
    margin: 0;
    color: inherit;
    font-size: 1rem;
  }

  && button:focus-visible {
    outline: 2px solid ${colorPrimary} !important;
  }
`;

const TrayItemName = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: ${panelText};
  font-size: .78rem;
  font-weight: 700;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TrayCheck = styled.span`
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-start-start-radius: 12px;
  border-end-end-radius: 10px;
  background-color: ${colorPrimary};
  color: ${colorWhite};
  pointer-events: none;

  svg {
    width: 13px;
    height: 13px;
    stroke-width: 3;
  }
`;

export default {
  TrayGrid,
  TrayDropzone,
  TrayDropzoneTitle,
  TrayDropzoneHint,
  TrayItem,
  TrayThumbnail,
  TrayItemFooter,
  TrayItemName,
  TrayCheck,
  PresentationsContainer,
  PresentationItemContainer,
  PresentationThumbnail,
  PresentationItemBottomContainer,
  PresentationItemName,
  UploadIcon,
  RemoveButton,
  UploaderDropzone,
  DropzoneMessage,
  DropzoneLink,
  ExtraHint,
  ExternalUpload,
  ExternalUploadTitle,
  ExternalUploadButton,
};
