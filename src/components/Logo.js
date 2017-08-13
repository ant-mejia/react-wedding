import React from 'react';

class Logo extends React.Component {

  render() {
    return (
      <div className={`logo ${this.props.classes}`}>
        <span className="text">D & J</span>
      </div>
    );
  }

}

export default Logo;
