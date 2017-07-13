import React, { Component } from 'react';

class GuestbookForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let preview = null;
    if (this.props.imgSrc) {
      preview = <img src={this.props.imgSrc}/>
    } else {
      preview = <p>No Image</p>
    }
    return (
      <div>
        <p>Message Form</p>
        {preview}
      </div>
    );
  }

}

export default GuestbookForm;
