import React, { Component } from 'react';

class Message extends Component {

  render() {
    return (
      <div onDoubleClick={e => console.log(e)}>
        <h1 className="uk-text-center">{this.props.msg.message}</h1>
      </div>
    );
  }

}

Message.propTypes = {
  msg: React.PropTypes.object.isRequired,
};
export default Message;
