import React, { Component } from 'react'
import { GoogleLogout } from 'react-google-login'
import { connect } from 'react-redux';
import { setUser } from '../state/actions'
import { isLoggedIn } from '../utils/user'
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components'
import colors from '../utils/colors'

const LogoutTextStyled = styled.a`
  cursor: pointer;
  :hover {
    text-decoration: underline !important;
  }
  padding-left: 16px;
  border-left: 1px solid ${colors.WHITE};
  margin-left: 16px;
`;

export default function LogoutWrapper() {
  const history = useHistory()
  const location = useLocation()
  return (<LogoutConnected history={ history } location={ location } />);
}

class Logout extends Component {
  logout = () => {
    this.props.clearUser()
    if (this.props.location.pathname === "/new-story") {
      this.props.history.push("/")
    }
  }

  render() {
    return isLoggedIn(this.props.user) && (
      <GoogleLogout
        clientId={ process.env.REACT_APP_GOOGLE_CLIENT_ID }
        render={renderProps => (
          <LogoutTextStyled onClick={ renderProps.onClick } disabled={ renderProps.disabled }>Logout</LogoutTextStyled>
        )}
        buttonText="Logout"
        onLogoutSuccess={ this.logout }
      />
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.app.user,
});

const mapDispatchToProps = (dispatch) => ({
  clearUser: () => dispatch(setUser({})),
});

const LogoutConnected = connect(mapStateToProps, mapDispatchToProps)(Logout);
