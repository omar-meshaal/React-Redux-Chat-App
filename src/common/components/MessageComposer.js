import React, { Component } from 'react';
import PropTypes from "prop-types";
import moment from 'moment';
import { Input } from 'react-bootstrap';
import uuid from 'node-uuid';

export default class MessageComposer extends Component {

  static propTypes = {
    activeChannel: PropTypes.string.isRequired,
    onSave: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      typing: false
    };
  }
  handleSubmit(event) {
    const { user, socket, activeChannel} = this.props;
    const text = event.target.value.trim();
    if (event.which === 13) {
      event.preventDefault();
      var newMessage = {
        id: `${Date.now()}${uuid.v4()}`,
        channelID: this.props.activeChannel,
        text: text,
        user: user,
        time: moment.utc().format('LT')
      };
      socket.emit('new message', newMessage);
      socket.emit('stop typing', { user: user.username, channel: activeChannel });
      this.props.onSave(newMessage);
      this.setState({ text: '', typing: false });
    }
  }
  handleChange(event) {
    const { socket, user, activeChannel } = this.props;
    this.setState({ text: event.target.value });
    if (event.target.value.length > 0 && !this.state.typing) {
      socket.emit('typing', { user: user.username, channel: activeChannel });
      this.setState({ typing: true});
    }
    if (event.target.value.length === 0 && this.state.typing) {
      socket.emit('stop typing', { user: user.username, channel: activeChannel });
      this.setState({ typing: false});
    }
  }
  render() {
    return (
      <div style={{
        zIndex: '52',
        left: '21.1rem',
        right: '1rem',
        width: '95%',
        flexShrink: '0',
        order: '2',
        marginTop: '0.5em'
      }}>
        <Input
          style={{
            height: '100%',
            fontSize: '2em',
            marginLeft: '0.8em',
            borderRadius: '0.9em'
          }}
          type="textarea"
          name="message"
          ref="messageComposer"
          autoFocus="true"
          placeholder="Type here to chat!"
          value={this.state.text}
          onChange={this.handleChange.bind(this)}
          onKeyDown={this.handleSubmit.bind(this)}
        />
      </div>
    );
  }
}
