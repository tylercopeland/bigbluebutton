import styled from 'styled-components';
import FilterStyled from '/imports/ui/components/user-list/filters/styles';
import { colorDanger } from '/imports/ui/stylesheets/styled-components/palette';

const Scope = styled(FilterStyled.Filters)`
  padding: 0;
`;

const { Chip } = FilterStyled;

const Badge = styled(FilterStyled.Count)`
  color: #FFF;
  background-color: ${colorDanger};
`;

export default {
  Scope,
  Chip,
  Badge,
};
