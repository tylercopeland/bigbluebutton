import styled from 'styled-components';

const ReactionsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  user-select: none;
  margin-inline-start: 38px;

  .bbb-chat-message--bubble & {
    margin-inline-start: 0;
  }
`;

export default {
  ReactionsWrapper,
};
