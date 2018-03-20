import * as types from '../constants/ActionTypes';
import { browserHistory } from 'react-router';
import axios from 'axios';
import moment from 'moment';


function addMessage(message) {
  return {
    type: types.ADD_MESSAGE,
    message
  };
}

export function receiveRawMessage(message) {
  return {
    type: types.RECEIVE_MESSAGE,
    message
  };
}

export function receiveRawChannel(channel) {
  return {
    type: types.RECEIVE_CHANNEL,
    channel
  };
}

function addChannel(channel) {
  return {
    type: types.ADD_CHANNEL,
    channel
  };
}

export function typing(username) {
  return {
    type: types.TYPING,
    username
  };
}

export function stopTyping(username) {
  return {
    type: types.STOP_TYPING,
    username
  };
}

export function changeChannel(channel) {
  return {
    type: types.CHANGE_CHANNEL,
    channel
  };
}

export function welcomePage(username) {
  return {
    type: types.SAVE_USERNAME,
    username
  };
}

export function fetchChannels(user) {
  return dispatch => {
    dispatch(requestChannels())
    return axios.get(`/api/channels/${user}`)
      .then(response => dispatch(receiveChannels(response.data)))
      .catch(error => { throw error });
  }
}

function requestChannels() {
  return {
    type: types.LOAD_CHANNELS
  }
}

function receiveChannels(json) {
  return {
    type: types.LOAD_CHANNELS_SUCCESS,
    json
  }
}

function requestMessages() {
  return {
    type: types.LOAD_MESSAGES
  }
}

export function fetchMessages(channel) {
  return dispatch => {
    dispatch(requestMessages())
    return axios.get(`/api/messages/${channel}`)
      .then(response => dispatch(receiveMessages(response.data, channel)))
      .catch(error => { throw error });
  }
}

function receiveMessages(json, channel) {
  const date = moment().format('lll');
  return {
    type: types.LOAD_MESSAGES_SUCCESS,
    json,
    channel,
    date
  }
}

function loadingValidationList() {
  return {
    type: types.LOAD_USERVALIDATION
  }
}

function receiveValidationList(json) {
  return {
    type: types.LOAD_USERVALIDATION_SUCCESS,
    json
  }
}

export function usernameValidationList() {
  return dispatch => {
    dispatch(loadingValidationList())
    return axios.get('/api/all_usernames')
      .then(response => {
        return dispatch(receiveValidationList(response.data.map((item) => item.local.username)))
      })
      .catch(error => { throw error });
  }
}

export function createMessage(message) {
  return dispatch => {
    dispatch(addMessage(message))
    return axios({
      url: '/api/newmessage',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: message
    })
      .catch(error => { throw error });
  }
}

export function createChannel(channel) {
  return dispatch => {
    return axios({
      url: '/api/channels/new_channel',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: channel
    }).then(response =>dispatch(addChannel(response.data)))
    .catch(error => { throw error }); 
  }
}




function changeWidthAndHeight(screenHeight, screenWidth) {
  return {
    type: types.CHANGE_WIDTH_AND_HEIGHT,
    screenHeight,
    screenWidth
  };
}

export function initEnvironment() {
  return dispatch => {


    dispatch(changeWidthAndHeight(window.innerHeight, window.innerWidth));

    window.onresize = () => {
      dispatch(changeWidthAndHeight(window.innerHeight, window.innerWidth));
    }
  };
}
