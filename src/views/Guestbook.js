import React, { Component } from 'react';
import io from 'socket.io-client';
import Message from '../components/Message';

class Guestbook extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] };
    this.socket = io('http://localhost:5000/guestbook');
    this.socket.on('update messages', (data) => {
      this.setState({ messages: data });
    });
  }

  componentDidMount() {
    this.socket.emit('get messages', (data) => {
      console.log(data);
    })
  }

  componentWillUnmount() {
    this.socket.close()
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.socket.emit('new message', event.target.querySelector('.messageInput').value)
  }

  render() {
    return (
      <div>
        {this.state.messages.map(msg => {
          return <Message key={msg.uid} msg={msg}/>
        })}
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <input className="messageInput" type="text"/>
          <input type="submit"/>
        </form>
      </div>
    );
  }

}

export default Guestbook;
