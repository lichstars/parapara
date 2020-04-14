import {
  SET_STORY,
  SET_NOT_MY_STORIES_LIST,
  SET_MY_STORY_LIST,
  SET_USER,
  SET_NEW_STORY,
  ADD_MY_STORY,
  REMOVE_NOT_MY_STORY,
} from './actions';

const defaultState = {
  story: {},
  notmystories: [],
  mystories: [],
  user: {},
};

const appReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_STORY: {
      return Object.assign({}, state, { story: action.story })
    }

    case SET_NEW_STORY: {
      const newStory = { ...action.story }
      const mystories = Array.from(state.mystories)
      mystories.unshift(newStory)
      return Object.assign({}, state, { mystories: mystories.sort(sortByTitle), story: newStory })
    }

    case SET_NOT_MY_STORIES_LIST: {
      const newList = action.stories.map(story => ({ ...story }))
      const notmystories = newList.sort(sortByTitle)
      return Object.assign({}, state, { notmystories })
    }

    case SET_MY_STORY_LIST: {
      const newList = action.stories && action.stories.map(story => ({ ...story }))
      const mystories = newList.sort(sortByTitle)
      return Object.assign({}, state, { mystories })
    }

    case SET_USER: {
      return Object.assign({}, state, { user: action.user })
    }

    case ADD_MY_STORY: {
      const mystories = Array.from(state.mystories)
      mystories.unshift(action.story)
      return Object.assign({}, state, { mystories: mystories.sort(sortByTitle) })
    }

    case REMOVE_NOT_MY_STORY: {
      const notmystories = Array.from(state.notmystories)
      notmystories.splice(action.index, 1)
      return Object.assign({}, state, { notmystories })
    }

    default: {
      return state
    }
  }
}

const sortByTitle = (a, b) => {
  if(a.title < b.title) { return -1; }
  if(a.title > b.title) { return 1; }
  return 0;
}

export default appReducer
