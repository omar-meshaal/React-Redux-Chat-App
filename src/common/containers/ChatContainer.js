import React, { Component } from 'react';
import PropTypes from "prop-types";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import io from 'socket.io-client';

import * as actions from '../actions/actions';
import {receiveAuth} from '../actions/authActions';
import Chat from '../components/Chat';


const socket = io('', { path: '/api/chat' });
const initialChannel = 'Public'; 

class ChatContainer extends Component {
  componentDidMount() {
    const { dispatch, user } = this.props;
    if(!user.username) {
      dispatch(receiveAuth());
    }
    dispatch(actions.fetchMessages(initialChannel));
    dispatch(actions.fetchChannels(user.username));
  }
  render() {
    return (
      <Chat {...this.props} socket={socket} />
    );
  }
}
ChatContainer.propTypes = {
  messages: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  channels: PropTypes.array.isRequired,
  activeChannel: PropTypes.string.isRequired,
  typers: PropTypes.array.isRequired
}

function mapStateToProps(state) {
  return {
      messages: state.messages.data,
      channels: state.channels.data,
      activeChannel: state.activeChannel.name,
      user: state.auth.user,
      typers: state.typers,
      screenWidth: state.environment.screenWidth
  }
}
export default connect(mapStateToProps)(ChatContainer)
