import React from 'react';
import useToolName from '/imports/ui/components/sidebar-content/sections/useToolName';
import Styled from './styles';

interface SectionTitleProps {
  tool: string;
  /** Shown after the name in a lighter grey, like "People 14" */
  count?: number;
  /** Opens the arrange menu, on right-click */
  onOpenMenu?: (tool: string) => void;
}

/** The title of a section with a single tool. It can be dragged onto the other section. */
const SectionTitle: React.FC<SectionTitleProps> = ({ tool, count, onOpenMenu }) => {
  const toolName = useToolName();

  return (
    <Styled.Title
      data-section-title={tool}
      data-test="sectionTitle"
      onContextMenu={onOpenMenu && ((event: React.MouseEvent) => {
        event.preventDefault();
        onOpenMenu(tool);
      })}
    >
      <Styled.TitleText>{toolName(tool)}</Styled.TitleText>
      {typeof count === 'number' && <Styled.Count>{count}</Styled.Count>}
    </Styled.Title>
  );
};

export default SectionTitle;
