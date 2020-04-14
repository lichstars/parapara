import React, { Component, useEffect } from 'react';
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { useParams } from "react-router-dom";
import styled from 'styled-components';
import { updateStory, maybeAddNewUser } from '../state/actions'
import { isLoggedIn } from '../utils/user'
import { media } from '../utils/media';
import TextInput from '../form/TextInput'
import Write from './Write'
import AuthorImages from './AuthorImages'
import Paragraphs from './Paragraphs'

const Container = styled.div`padding-bottom: 16px;`;
const StoryContainer = styled.div`${media.small`padding: 0 16px;`}`;

export default function StoryWrapper({ fetchStory }) {
  const story_id = useParams().story_id
  useEffect(() => { fetchStory(story_id) }, [fetchStory, story_id]);
  return (<ConnectedStory />);
}

class Story extends Component {
  render() {
    return (
      <Container>
        <Field
          name="title"
          component={ TextInput }
          placeholder={ this.props.story.title }
          type="text"
          disabled={ !isLoggedIn(this.props.user) }
        />
        <AuthorImages props={ this.props } />
        <StoryContainer>
          <Paragraphs props={ this.props} />
          <Write props={ this.props } />
        </StoryContainer>
      </Container>
    )
  }
}

const StoryForm = reduxForm({ form: 'addStoryForm' })(Story)

const mapStateToProps = (state) => ({
  story: state.app.story,
  user: state.app.user,
});

const mapDispatchToProps = (dispatch) => ({
  saveStory: (share_page_url) => dispatch(updateStory(share_page_url)),
  maybeAddNewUser: (user) => dispatch(maybeAddNewUser(user)),
});

const ConnectedStory = connect(mapStateToProps, mapDispatchToProps)(StoryForm);
