import React, { Component } from 'react';

class Preloader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ loaded: true })
    }, 800)
  }

  render() {
    return (
      <div id="preload" className={this.state.loaded ? 'loaded': 'loading'}>
      </div>
    );
  }

}

export default Preloader;
