import React from 'react';
import useToolName from '/imports/ui/components/sidebar-content/sections/useToolName';
import Styled from './styles';

interface SectionTitleProps {
  tool: string;
  /** Shown after the name in a lighter grey, like "PEOPLE 14" */
  count?: number;
}

/** The title of a section with a single tool. It can be dragged onto the other section. */
const SectionTitle: React.FC<SectionTitleProps> = ({ tool, count }) => {
  const toolName = useToolName();

  return (
    <Styled.Title data-section-title={tool} data-test="sectionTitle">
      <Styled.TitleText>{toolName(tool)}</Styled.TitleText>
      {typeof count === 'number' && <Styled.Count>{count}</Styled.Count>}
    </Styled.Title>
  );
};

export default SectionTitle;
