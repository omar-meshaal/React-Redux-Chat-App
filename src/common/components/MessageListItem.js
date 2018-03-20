import React from 'react';
import PropTypes from "prop-types";

export default class MessageListItem extends React.Component {
  static propTypes = {
    message: PropTypes.object.isRequired
  };
  handleClick(user) {
    this.props.handleClickOnUser(user);
  }
  render() {
    const { message, user } = this.props;
    return (

      <div key={message.id}
        className={`message-container ${message.user.username === user.username && 'right'}`}>
        <div className="time">{message.time}</div>
        <div className="data">
          <div className="message">{message.text}</div>
          <div className="name" ><a href="#" onClick={this.handleClick.bind(this, message.user)} >{message.user.username}</a></div>
        </div>
      </div>
    );
  }
}
