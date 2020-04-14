import React from 'react';
import styled from 'styled-components'
import AddNewStoryButton from '../AddNewStoryButton'
import { Row, Heading, StyledLink, Title, Section } from './styles'

const NewStoryHeaderSection = styled.div`
  display: flex !important;
  flex-direction: row;
  justify-content: space-between;
  outline: none !important;
  align-items: center;
`;

const Stories = ({ props }) => {
  return (
    <Section>
      <Row>
        <NewStoryHeaderSection>
          <Heading>Stories</Heading>
          <AddNewStoryButton closeMenu={ props.closeMenu } />
        </NewStoryHeaderSection>
      </Row>
      {
        props.notmystories.map((story, index) => (
          <StyledLink key={ index } onClick={ props.closeMenu } to={ `/story/${ story.id }` }>
            <Row isActive={ props.isActive(story.id) }>
              <Title>
                { story.title }
              </Title>
            </Row>
          </StyledLink>
        ))
      }
    </Section>
  )
}

export default Stories;
