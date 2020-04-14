import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { media } from '../../utils/media';
import colors from '../../utils/colors'

export const Row = styled.div`
  padding: 8px 16px;
  background: ${props => props.isActive ? colors.DARKPURPLE : 'inherit' };
  ${media.small`padding: 6px 16px;`}
  :hover { background: ${props => props.isActive ? colors.DARKPURPLE : colors.MENUHOVERITEM }; }
`;

export const Title = styled.div`
  padding: 2px 16px;
  font-weight: ${props => props.isActive ? 600 : 'inherit' };
`;

export const StyledLink = styled(Link)`
  color: ${colors.BRIGHTGREEN};
  a { color: ${colors.BRIGHTGREEN}; }
  :hover { color: ${colors.BRIGHTGREEN}; text-decoration: underline; }
`;

export const Heading = styled.div`
  font-size: 10px;
  ${media.small`
    font-size: 12px;
  `}
  font-weight: 600;
  padding-top: 2px;
  color: ${colors.PINK};
`;

export const Section = styled.div`padding-bottom: 8px;`;
