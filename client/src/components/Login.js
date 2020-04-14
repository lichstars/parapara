import React, { Component } from 'react'
import { GoogleLogin } from 'react-google-login'

class Login extends Component {
  render() {
    return (
      <GoogleLogin
        clientId={ process.env.REACT_APP_GOOGLE_CLIENT_ID }
        buttonText="Login"
        onSuccess={ this.props.onSuccess }
        onFailure={ this.props.onFailure }
        cookiePolicy={ 'single_host_origin' }
        isSignedIn={ true }
        render={ this.props.customRender }
      />
    );
  }
}
export default Login;
