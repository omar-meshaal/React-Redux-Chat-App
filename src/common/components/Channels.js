import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Modal, Glyphicon, Input, Button } from 'react-bootstrap';
import uuid from 'node-uuid';

import ChannelListItem from './ChannelListItem';
import * as actions from '../actions/actions';

export default class Channels extends Component {

  static propTypes = {
    channels: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
    messages: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      addChannelModal: false,
      channelName: ''
    };
  }
  handleChangeChannel(channel) {
    this.props.onClick(channel);
  }
  openAddChannelModal(event) {
    event.preventDefault();
    this.setState({addChannelModal: true});
  }
  closeAddChannelModal(event) {
    event.preventDefault();
    this.setState({addChannelModal: false});
  }
  handleModalChange(event) {
    this.setState({channelName: event.target.value});
  }
  handleModalSubmit(event) {
    const { channels, dispatch, socket } = this.props;
    event.preventDefault();
    if (this.state.channelName.length < 1) {
      this.refs.channelName.getInputDOMNode().focus();
    }
    if (this.state.channelName.length > 0 && channels.filter(channel => {
      return channel.name === this.state.channelName.trim();
    }).length < 1) {
      const newChannel = {
        name: this.state.channelName.trim(),
        id: `${Date.now()}${uuid.v4()}`,
        private: false
      };
      dispatch(actions.createChannel(newChannel));
      this.handleChangeChannel(newChannel);
      socket.emit('new channel', newChannel);
      this.setState({channelName: ''});
      this.closeAddChannelModal(event);
    }
  }
  validateChannelName() {
    const { channels } = this.props;
    if (channels.filter(channel => {
      return channel.name === this.state.channelName.trim();
    }).length > 0) {
      return 'error';
    }
    return 'success';
  }

  render() {
    const { channels, messages } = this.props;
    const newChannelModal = (
      <div>
        <Modal key={1} show={this.state.addChannelModal} onHide={this.closeAddChannelModal.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Channel</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={this.handleModalSubmit.bind(this)} >
            <Input
              ref="channelName"
              type="text"
              help={this.validateChannelName() === 'error' && 'A channel with that name already exists!'}
              bsStyle={this.validateChannelName()}
              hasFeedback
              name="channelName"
              autoFocus="true"
              placeholder="Enter the channel name"
              value={this.state.channelName}
              onChange={this.handleModalChange.bind(this)}
            />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeAddChannelModal.bind(this)}>Cancel</Button>
            <Button disabled={this.validateChannelName() === 'error' && 'true'} onClick={this.handleModalSubmit.bind(this)} type="submit">
              Create Channel
            </Button>
          </Modal.Footer>
          </Modal>
      </div>
    );
    
    return (
      <section>
        <div>
          <span style={{paddingLeft: '0.8em', fontSize: '1.5em'}}>
            Channels
            <button onClick={this.openAddChannelModal.bind(this)} style={{fontSize: '0.8em', 'background': 'Transparent', marginLeft: '2.8em', 'backgroundRepeat': 'noRepeat', 'border': 'none', 'cursor': 'pointer', 'overflow': 'hidden', 'outline': 'none'}}>
              <Glyphicon glyph="plus" />
            </button>
          </span>
          <hr/>
        </div>
          {newChannelModal}
        <div>
          <ul style={{display: 'flex', flexDirection: 'column', listStyle: 'none', margin: '0', overflowY: 'auto', padding: '0'}}>
            {channels.map(channel =>
              <ChannelListItem  style={{paddingLeft: '0.8em', background: '#2E6DA4', height: '0.7em'}} messageCount={messages.filter(msg => {
                return msg.channelID === channel.name;
              }).length} channel={channel} key={channel.id} onClick={this.handleChangeChannel.bind(this)} />
              )}
          </ul>
        </div>
      </section>
    );
  }
}
