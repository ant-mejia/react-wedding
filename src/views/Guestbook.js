import React, { Component } from 'react';
import localStorage from 'localStorage';
import io from 'socket.io-client';
import Message from '../components/Message';
import GuestbookForm from '../components/GuestbookForm';

class Guestbook extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [], imagePre: '' };
    this.socket = io('http://localhost:5000/guestbook', {
      query: {
        jta: localStorage.getItem('jta')
      }
    });
    this.socket.on('connection', (socket) => {
      let token = socket.handshake.query.token;
      console.log(token);
    });
    this.socket.on('update messages', (data) => {
      console.log('getting')
      this.setState({ messages: data });
      console.log(data);
    });
  }

  componentDidMount() {
    this.socket.emit('get messages', (data) => {
      console.log(data);
    });
  }

  componentWillUnmount() {
    this.socket.close()
  }

  previewImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ preview: e.target.result });
      }

      reader.readAsDataURL(e.target.files[0]);
    } else {
      this.setState({ preview: '' })
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let packet = { message: event.target.querySelector('.messageInput').value };
    console.log(event.target.querySelector('.fileInput').files);
    if (event.target.querySelector('.fileInput').files.length !== 0) {
      packet.file = {
        buffer: event.target.querySelector('.fileInput').files['0'],
        ext: event.target.querySelector('.fileInput').files['0'].type.split('/')[1],
        files: event.target.querySelector('.fileInput').files
      }
    }
    this.socket.emit('new message', packet, (data) => {
      console.log(data, "SUCESSQ!");
    });
    console.log(event.target.querySelector('.fileInput').files['0']);
    event.target.querySelector('.messageInput').value = '';
  }

  render() {
    return (
      <div>
        {this.state.messages.map(msg => {
          return <Message key={msg.uid} msg={msg}/>
        })}
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <input className="messageInput" type="text"/>
          <input ref="fileInput" type="file" className="fileInput" accept="image/png, image/jpeg, image/gif" onChange={e => this.previewImage(e)}/>
          <input type="submit"/>
        </form>
        <GuestbookForm imgSrc={this.state.preview}/>
      </div>
    );
  }

}

export default Guestbook;
