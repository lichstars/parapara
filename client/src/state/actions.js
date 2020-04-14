import { request, handleResponse } from '../utils/request';
import { change } from 'redux-form';
import { v4 as uuidv4 } from 'uuid';
import { isLoggedIn } from '../utils/user';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

export const SET_NOT_MY_STORIES_LIST = 'SET_NOT_MY_STORIES_LIST';
export const setNotMyStoriesList = (stories) => ({ type: SET_NOT_MY_STORIES_LIST, stories });

export const SET_MY_STORY_LIST = 'SET_MY_STORY_LIST';
export const setMyStoriesList = (stories) => ({ type: SET_MY_STORY_LIST, stories });

export const SET_USER = 'SET_USER';
export const setUser = (user) => ({ type: SET_USER, user });

export const SET_STORY = 'SET_STORY'
export const setStory = (story) => ({ type: SET_STORY, story })

export const SET_NEW_STORY = 'SET_NEW_STORY'
export const setNewStory = (story) => ({ type: SET_NEW_STORY, story })

export const ADD_MY_STORY = 'ADD_MY_STORY'
export const addMyStory = (story) => ({ type: ADD_MY_STORY, story })

export const REMOVE_NOT_MY_STORY = 'REMOVE_NOT_MY_STORY'
export const removeMyStory = (index) => ({ type: REMOVE_NOT_MY_STORY, index })

export const fetchStory = (story_id) => (dispatch, getState) => {
  return request.fetch(`${API_ENDPOINT}/story?id=${story_id}`)
  .then(handleResponse)
  .then(story => dispatch(setStory(story)))
  .then(() => {
    if (isLoggedIn(getState().app.user) && getState().app.user.stories !== undefined) {
      const index = getState().app.user.stories.findIndex(item => item.id === story_id)
      if (index >= 0 && getState().app.user.stories[index].cursor < getState().app.story.paras.length) {
        dispatch(linkUserToStory(getState().app.user.email, story_id, getState().app.story.paras.length))
      }
    }
  })
  .then(() => dispatch(change('addStoryForm', 'title', getState().app.story.title)))
  .catch(error => console.log(error))
};

export const fetchStories = () => (dispatch, getState) => {
  return request.fetch(`${API_ENDPOINT}/stories`)
    .then(handleResponse)
    .then((stories) => dispatch(extractMyStories(stories)))
}

const extractMyStories = (fetchedStories) => (dispatch, getState) => {
  const user = getState().app.user;
  if (user === undefined || !isLoggedIn(user)) {
    dispatch(setMyStoriesList([]))
    dispatch(setNotMyStoriesList(fetchedStories))
  } else {
    const mystories = []
    const notmystories = Array.from(getState().app.notmystories);
    getState().app.user?.stories && getState().app.user.stories.forEach((userStory, _) => {
      const i = notmystories.findIndex(item=>item.id === userStory.id)
      const foundItem = notmystories[i]
      if (foundItem !== undefined) {
        mystories.unshift(foundItem)
        notmystories.splice(i, 1)
      }
    })
    dispatch(setNotMyStoriesList(notmystories))
    dispatch(setMyStoriesList(mystories))
  }
}

export const saveStory = (history) => (dispatch, getState) => {
  if (getState().form.newStoryForm.values === undefined) return
  if ((getState().form.newStoryForm.values.title.trim() === "")
  || (getState().form.newStoryForm.values.text.trim() === "")) return
  const story_id = uuidv4()
  const story = {
    id: story_id,
    title: getState().form.newStoryForm.values.title.trim(),
    created_at: Date.now(),
    updated_at: null,
    created_by: getState().app.user,
    updated_by: null,
    paras: [{
      text: getState().form.newStoryForm.values.text.trim(),
      created_at: Date.now(),
      updated_at: null,
      created_by: getState().app.user,
    }],
  }
  return request.fetch(`${API_ENDPOINT}/new-story`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(story),
  })
    .then(handleResponse)
    .then(() => dispatch(setNewStory(story)))
    .then(() => dispatch(linkUserToStory(story.created_by.email, story_id, story.paras.length)))
    .then(() => dispatch(updateStoryList(story)))
    .then(() => history.push(`/story/${story_id}`))
    .catch(error => console.log(error))
}

export const updateStory = (pageUrl) => (dispatch, getState) => {
  if (getState().form.addStoryForm.values === undefined) return
  if (getState().form.addStoryForm.values.text.trim() === "") return
  const story = {
    id: getState().app.story.id,
    title: getState().form.addStoryForm.values.title.trim(),
    updated_by: getState().app.user,
    updated_at: Date.now(),
    para:  {
      text: getState().form.addStoryForm.values.text.trim(),
      created_at: Date.now(),
      updated_at: null,
      created_by: getState().app.user,
    },
  }
  return request.fetch(`${API_ENDPOINT}/update-story`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(story),
  })
    .then(handleResponse)
    .then(() => {
      const currentStory = Object.assign({}, getState().app.story)
      currentStory.paras.push(story.para)
      currentStory.title = story.title
      currentStory.updated_by = story.updated_by
      currentStory.updated_at = story.updated_at
      dispatch(setStory({ ...currentStory }))
    })
    .then(() => dispatch(change('addStoryForm', 'text', "")))
    .then(() => dispatch(linkUserToStory(story.updated_by.email, story.id, getState().app.story.paras.length)))
    .then(() => dispatch(updateStoryList(story)))
    .then(() => dispatch(notifyByEmail(pageUrl, story, getState().app.user)))
    .catch(error => console.log(error))
}

const updateStoryList = (s) => (dispatch, getState) => {
  const index = getState().app.notmystories.findIndex(item=>item.id === s.id)
  if (index >= 0) {
    const newMyStory = getState().app.notmystories[index]
    dispatch(addMyStory(newMyStory))
    dispatch(removeMyStory(index))
  }
}

const linkUserToStory = (email, story_id, cursor) => (dispatch, getState) => {
  const reqbody = { email, story_id, cursor }
  return request.fetch(`${API_ENDPOINT}/link-story`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(reqbody),
  })
    .then(handleResponse)
    .then((stories) => {
      const user = Object.assign({}, getState().app.user)
      user.stories = stories
      dispatch(setUser(user))
    })
}

export const maybeAddNewUser = (user) => (dispatch) => {
  return request.fetch(`${API_ENDPOINT}/new-user`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(user),
  }).then(handleResponse)
  .then((dbUser) => dispatch(setUser(dbUser)))
  .catch(error => console.log(error))
};

export const notifyByEmail = (pageUrl, story, user) => (dispatch, getState) => {
  const notifyRequest = {
    id: story.id,
    pageUrl,
    fromGivenName: user.givenName,
    email: user.email
  }
  return request.fetch(`${API_ENDPOINT}/notify`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(notifyRequest),
  }).then(handleResponse)
    .catch(error => console.log(error))
}
