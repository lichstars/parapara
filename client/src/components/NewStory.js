import React, { Component } from 'react'
import { reduxForm, Field, reset } from 'redux-form'
import TextArea from '../form/TextArea'
import TextInput from '../form/TextInput'
import { saveStory } from '../state/actions'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../utils/colors'
const TITLE_PLACEHOLDER = "Title goes here..."

const Commit = styled.div`
  color: ${colors.BRIGHTGREEN};
  text-decoration:underline;
  text-decoration-style:dashed;
  font-weight:600;
  :hover{ text-decoration: underline; cursor: pointer;}
`;

const WritingTextBox = styled.div`
  padding: 16px 0;
`;

export default function NewStoryWrapper() {
  const history = useHistory()
  return (<NewStoryConnected history={ history } />);
}

class NewStory extends Component {
  componentDidMount() {
    this.props.resetForm()
  }

  render() {
    return (
      <div>
        <Field name="title" component={ TextInput } placeholder={ TITLE_PLACEHOLDER } type="text" />
        <WritingTextBox><Field name="text" component={ TextArea } rows={ 10 } placeholder="Start writing here" /></WritingTextBox>
        <Commit onClick={ () => this.props.saveStory(this.props.history) }>commit</Commit>
      </div>
    );
  }
}

const StoryForm = reduxForm({ form: 'newStoryForm' })(NewStory)

const mapDispatchToProps = (dispatch) => ({
  saveStory: (history) => dispatch(saveStory(history)),
  resetForm: () => dispatch(reset('newStoryForm')),
});

const NewStoryConnected = connect(null, mapDispatchToProps)(StoryForm)
