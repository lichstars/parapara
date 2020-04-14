import React, { Component } from 'react'
import { connect } from 'react-redux'
import { maybeAddNewUser } from '../state/actions'
import { isLoggedIn } from '../utils/user'
import Login from './Login'
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../utils/colors'

const ClickableButton = styled.div`
  outline: none !important;
  width: 50px;
  text-align: center;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${colors.PINK};
  font-size: 24px;
  :hover {
    cursor: pointer;
    color: ${colors.GREY};
  }
`;

export default function AddNewStoryButtonWrapper({ closeMenu }) {
  const history = useHistory()
  return (<ConnectedAddNewStoryButton history={ history } closeMenu={ closeMenu } />);
}

class AddNewStoryButton extends Component {
  constructor(props) {
    super(props)
    this.state = { hasClicked: false }
  }

  successLogin = (response) => {
    const { email, imageUrl, givenName, familyName, name } = response.profileObj
    this.props.maybeAddNewUser({ email, imageUrl, givenName, familyName, name })
    if (this.state.hasClicked) {
      this.props.history.push("/new-story")
    }
  }

  failLogin = (response) => {
    console.log("failed to log user in because: " + JSON.stringify(response))
  }

  buttonOnClick = (renderProps) => {
    renderProps.onClick()
    this.setState({ hasClicked: true })
  }

  redirect = (event) => {
    this.props.closeMenu()
    this.props.history.push("/new-story")
  }

  render() {
    return (
      <div>
        { isLoggedIn(this.props.user)
          ? <ClickableButton onClick={ (event) => this.redirect(event) } className="fa fa-plus-circle" />
          : <Login onSuccess={ this.successLogin } onFailure={ this.failLogin } customRender={renderProps => (
              <ClickableButton className="fa fa-plus-circle" onClick={ () => this.buttonOnClick(renderProps) } disabled={ renderProps.disabled } />
              )} />
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.app.user,
});

const mapDispatchToProps = (dispatch) => ({
  maybeAddNewUser: (user) => dispatch(maybeAddNewUser(user)),
});

const ConnectedAddNewStoryButton = connect(mapStateToProps, mapDispatchToProps)(AddNewStoryButton);
