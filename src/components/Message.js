import React, { Component } from 'react';
import Moment from 'react-moment';

class Message extends Component {

  render() {
    let image = '';
    if (this.props.msg.image) {
      image = (
        <div className="image-container">
          <img className="" src={this.props.msg.image.data}/>
      </div>)
    }
    return (
      <div onDoubleClick={e => console.log(e)}>
        <h1 className="uk-text-center">{this.props.msg.message}</h1>
        <p>
          <Moment fromNow>{this.props.msg.createdAt}</Moment>
        </p>
        {image}
        <p>{this.props.msg.user.firstname} {this.props.msg.user.lastname}</p>
      </div>
    );
  }

}

Message.propTypes = {
  msg: React.PropTypes.object.isRequired,
};
export default Message;
