import styled from 'styled-components';

const Content = styled.div<{ $isTray?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: ${({ $isTray }) => ($isTray ? '4px 2px 10px' : '0 1.5rem 1.5rem')};
  text-align: left;

  #preview {
    max-height: 10rem;
  }
`;

export default {
  Content,
};
