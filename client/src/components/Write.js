import React, { useEffect, useState, useRef } from 'react';
import { Field } from 'redux-form'
import Overlay from 'react-bootstrap/Overlay'
import Tooltip from 'react-bootstrap/Tooltip'
import Button from 'react-bootstrap/Button'
import styled from 'styled-components';
import TextArea from '../form/TextArea'
import { isLoggedIn } from '../utils/user'
import colors from '../utils/colors'
import Login from './Login'

const TextAreaContainer = styled.div`padding: 16px 0;`;
const StyledButton = styled(Button)`
  color: ${colors.BRIGHTGREEN};
  text-decoration:underline;
  text-decoration-style:dashed;
  padding: 0;
  :hover{ text-decoration: underline; cursor: pointer;}
`;

const Commit = styled.div`
  color: ${colors.BRIGHTGREEN};
  text-decoration:underline;
  text-decoration-style:dashed;
  font-weight:600;
  :hover{ text-decoration: underline; cursor: pointer;}
`;

const Write = ({ props }) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);

  useEffect(() => {
    if (show === true) {
      const timer = setTimeout(() => setShow(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [show])

  const publish = () => {
    props.saveStory(window.location.href)
    setShow(!show)
  }

  const successLogin = (response) => {
    const { email, imageUrl, givenName, familyName, name } = response.profileObj
    props.maybeAddNewUser({ email, imageUrl, givenName, familyName, name })
  }

  const failLogin = (response) => console.log("failed to log user in because: " + JSON.stringify(response))

  return (
    <div>
      {
        isLoggedIn(props.user) &&
        <div>
          <TextAreaContainer>
            <Field name="text" component={ TextArea } rows={ 10 } placeholder="Start writing here" />
          </TextAreaContainer>
          <Commit ref={ target } onClick={ publish }>commit</Commit>
          <Overlay target={ target.current } show={ show } placement="left">
            {(props) => (
              <Tooltip {...props}>We've let the other writers know that you wrote something!</Tooltip>
            )}
          </Overlay>
        </div>
      }

      {
        !isLoggedIn(props.user) &&
          <Login onSuccess={ successLogin } onFailure={ failLogin } customRender={renderProps => (
            <StyledButton variant="link" onClick={ renderProps.onClick }>Log in to add to this story.</StyledButton>
          )} />
      }
      </div>
  )
}

export default Write;
