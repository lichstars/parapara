import React from 'react';
import { Row, Heading, StyledLink, Title, Section } from './styles'
import { isLoggedIn } from '../../utils/user'
import styled from 'styled-components'

const StyledTitle = styled(Title)`
  font-weight: ${props => props.isUnread ? 800 : 'inerhit' };
`;

const MyStories = ({ props }) => {
  const isUnread = (story) => {
    const userStory = props.user.stories?.find(item => item.id === story.id)
    if (userStory?.cursor < story.paras.length) { return true; }
    return false;
  }

  return props.user && isLoggedIn(props.user) ? (
    props.mystories.length > 0 &&
    <Section>
      <Row><Heading>My stories</Heading></Row>
      {
        props.mystories.map((story, index) => (
          <StyledLink key={ index } onClick={ props.closeMenu } to={ `/story/${ story.id }` }>
            <Row isActive={ props.isActive(story.id) }>
              <StyledTitle isUnread={ isUnread(story) }>
                { story.title }
              </StyledTitle>
            </Row>
          </StyledLink>
        ))
      }
    </Section>
  ) : <div />
}

export default MyStories;
