import React, { Component } from 'react'
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import StoryList from './components/StoryList'
import Story from './components/Story'
import Header from './components/Header'
import NewStory from './components/NewStory'
import colors from './utils/colors'
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { reset } from 'redux-form'
import { fetchStory, fetchStories } from './state/actions'
import styled from 'styled-components'
import { media } from './utils/media';

const StyledContainer = styled(Container)`
  background: ${colors.BACKGROUND};
  color: ${colors.WHITE};
  height: 100%;
`

const BorderCol = styled(Col)`
  padding-left: 0px !important;
  padding-right: 0px !important;
  ${media.small`
    border-right: 1px solid ${colors.GREY};
  `}
`;

const HeaderBottomBorder = styled(Row)`
  border-bottom: 1px solid;
  border-bottom-color: ${colors.GREY};
  color: ${colors.BLACK};
`;

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { menuOpen: false }
  }

  handleStateChange = (state) => {
     this.setState({menuOpen: state.isOpen})
  }

  closeMenu = () => {
    this.setState({menuOpen: false})
  }

  toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen })
  }

  render() {
    return (
      <Router>
        <StyledContainer fluid>
          <HeaderBottomBorder><Header toggleMenu={ this.toggleMenu }/></HeaderBottomBorder>
          <Row>
            <BorderCol sm={3}>
              <StoryList
                menuOpen={ this.state.menuOpen }
                closeMenu={ this.closeMenu }
                handleStateChange={ this.handleStateChange }
                fetchStories={ this.props.fetchStories }
                user={ this.props.user }
              />
            </BorderCol>
            { !this.state.menuOpen &&
              <Col sm={9}>
                <Switch>
                  <Route path="/story/:story_id" children={ <Story fetchStory={ this.props.fetchStory } /> } />
                  <Route path="/new-story" children={ <NewStory /> } />
                </Switch>
              </Col>
            }
          </Row>
        </StyledContainer>
      </Router>
    );
  }
}

const mapStateToProps = (state) => ({
  story: state.app.story,
  user: state.app.user,
});

const mapDispatchToProps = (dispatch) => ({
  fetchStory: (story_id) => {
    dispatch(reset('addStoryForm'))
    dispatch(fetchStory(story_id))
  },
  fetchStories: () => dispatch(fetchStories()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
