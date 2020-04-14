import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux';
import { isLoggedIn } from '../utils/user'
import Logout from './Logout'
import Login from './Login'
import { maybeAddNewUser } from '../state/actions'
import { media } from '../utils/media';
import colors from '../utils/colors'

const Container = styled.div`
  padding-right:16px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  ${media.small`
    align-items: center;
    flex-direction: row;
  `}
  width: 100%;
`;

const HeadingRow = styled.div`
  margin-bottom: -10px;
  display: flex;
  justify-content: space-between;
  font-family: inherit;
  font-size: 60px;
  margin-bottom: -24px;
  ${media.small`
    margin-bottom: -30px;
    display: inherit;
    font-size: 4.5rem;
  `}
  background: ${colors.BRIGHTGREEN};
  margin-right: 20px;
`;

const BurgerMenuForMobile = styled.div`
  color: ${colors.BLACK};
  :hover {
    color: ${colors.BLACK};
  }
  ${media.small`
    display: none;
  `}
`;

const SubHeading = styled.h3`
  color: ${colors.GREY};
  float: right;
  ${media.small`
    float: left;
    padding-bottom: 16px;
    padding-top: 8px;
  `}
`

const LoginDetails = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 8px 0;
  padding-bottom: 24px;
  ${media.small`
    justify-content: space-around;
    padding: 0 0;
  `}
`;

const Title = styled.div`
  background: ${colors.RED};
`;

const NameStyled = styled.div`
  font-weight: 600;
  color: ${colors.YELLOW};
  text-decoration: underline;
  text-decoration-style: dashed;
`;

const LoginButtonTextStyled = styled.a`
  cursor: pointer;
  :hover {
    text-decoration: underline !important;
  }
`;

class Header extends Component {
  getName = () => {
    return this.props.user.givenName === undefined ? "" : this.props.user.givenName
  }

  successLogin = (response) => {
    const { email, imageUrl, givenName, familyName, name } = response.profileObj
    this.props.maybeAddNewUser({ email, imageUrl, givenName, familyName, name })
  }

  failLogin = (response) => {
    console.log("failed to log user in because: " + JSON.stringify(response))
  }

  render() {
    return (
      <Container>
        <Title>
          <HeadingRow>
            <BurgerMenuForMobile onClick={ this.props.toggleMenu }><i className="fa fa-bars" aria-hidden="true" /></BurgerMenuForMobile>
            <div>PARAPARA</div>
          </HeadingRow>
          <SubHeading>write together</SubHeading>
        </Title>
        <LoginDetails>
          <NameStyled>{ isLoggedIn(this.props.user) && `${ this.getName() }` }</NameStyled>
          { !isLoggedIn(this.props.user) &&
            <Login onSuccess={ this.successLogin } onFailure={ this.failLogin } customRender={ renderProps => (
              <LoginButtonTextStyled onClick={renderProps.onClick} disabled={renderProps.disabled}>Log in</LoginButtonTextStyled>) }
            /> }
          <Logout />
        </LoginDetails>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.app.user,
});

const mapDispatchToProps = (dispatch) => ({
  maybeAddNewUser: (user) => dispatch(maybeAddNewUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
