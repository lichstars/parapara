import React, { Component, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu'
import styled from 'styled-components'
import MyStories from './storylist/MyStories'
import Stories from './storylist/Stories'
import { media } from '../utils/media';
import colors from '../utils/colors'

const Container = styled.div`padding: 16px 0;`;
const MenuStyled = styled(Menu)`
  display: flex;
  width: 100% !important;
  margin-left: -15px;
  padding: 15px;
  background: ${colors.BACKGROUNDMOBILE};
  font-weight: 500;
  font-size: 14px;
`;
const Mobile = styled.div`${media.small` display: none; `}`;
const Desktop = styled.div`display: none;${media.small` display: inherit; `}`;

export default function StoryListWrapper({ fetchStories, user, menuOpen, closeMenu, handleStateChange }) {
  useEffect(() => { fetchStories() }, [fetchStories, user.email]);
  const history = useHistory();
  const isActive = (story_id) => history.location.pathname === `/story/${ story_id }`
  return (<ConnectedStoryList
    user={ user }
    menuOpen={ menuOpen }
    closeMenu={ closeMenu }
    handleStateChange={ handleStateChange }
    isActive={ isActive }
  />);
}

class StoryList extends Component {
  render() {
    return (
      <div>
        <Mobile><ListMobileWrapper props={ this.props } /></Mobile>
        <Desktop><List props={ this.props } /></Desktop>
      </div>
    )
  }
}

const ListMobileWrapper = ({ props }) => {
  return (
    <MenuStyled isOpen={ props.menuOpen } onStateChange={(state) => props.handleStateChange(state)}>
      <List props={ props } />
    </MenuStyled>
  );
}

const List = ({ props }) => {
  return (
    <Container>
      <MyStories props={ props } />
      <Stories props={ props } />
    </Container>
  );
}

const mapStateToProps = (state) => ({
  notmystories: state.app.notmystories,
  mystories: state.app.mystories,
});

const ConnectedStoryList = connect(mapStateToProps)(StoryList);
