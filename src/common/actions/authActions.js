import * as types from '../constants/ActionTypes';
import { browserHistory } from 'react-router';
import cookie from 'react-cookie';
import axios from 'axios';

export function receiveAuth() {
  const user = cookie.load('username');
  return {
    type: types.AUTH_LOAD_SUCCESS,
    user
  }
}

export function checkAuth() {
  if (cookie.load('username')) {
    return true;
  }
  return false;
}

function requestSignUp() {
  return {
    type: types.AUTH_SIGNUP
  }
}

function receiveUser(username) {
  const newUser = {
    name: username,
    id: Symbol(username)
  }
  return {
    type: types.AUTH_SIGNUP_SUCCESS,
    newUser
  }
}

function requestSignOut() {
  return {
    type: types.AUTH_SIGNOUT
  }
}
function receiveSignOut() {
  return {
    type: types.AUTH_SIGNOUT_SUCCESS
  }
}

export function signOut() {
  return dispatch => {
    dispatch(requestSignOut())
    return axios.get('/api/signout')
      .then(response => {
        cookie.remove('username')
        dispatch(receiveSignOut())
        browserHistory.push('/')
      })
      .catch(error => { throw error });
  }
}

export function signUp(user) {
  return dispatch => {
    dispatch(requestSignUp())
    return axios({
      method: 'post',
      url: '/api/sign_up',
      data: user,
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    })
      .then(response => {
        cookie.save('username', user.username)
        dispatch(receiveUser(user.username));
        browserHistory.push('/chat');
      })
      .catch(error => { throw error });
  };
}

function requestSignIn() {
  return {
    type: types.AUTH_SIGNIN
  }
}

function receiveSignInSuccess(username) {
  const user = {
    name: username,
    id: Symbol(username)
  }
  return {
    type: types.AUTH_SIGNIN_SUCCESS,
    user
  }
}

function receiveSignInFail(error) {
  return {
    type: types.AUTH_SIGNIN_FAIL,
    error
  }
}

export function signIn(user) {
  return dispatch => {
    dispatch(requestSignIn())
    return axios({
      method: 'post',
      url: '/api/sign_in',
      data: user,
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    },
    )
      .then(response => {
        cookie.save('username', user.username)
        dispatch(receiveSignInSuccess(user.username));
        browserHistory.push('/chat');
      })
      .catch(error => {
        dispatch(receiveSignInFail(error.response.data));
      });
  };
}

export function receiveSocket(socketID) {
  return {
    type: types.RECEIVE_SOCKET,
    socketID
  }
}
