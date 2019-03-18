import React, { Component } from 'react';
import { Fade } from 'react-bootstrap';
import './Inflight.css';

class Inflight extends Component {
  render() {
    const { inflight } = this.props;

    return (
      <Fade in={inflight} className={this.props.className}>
        <div className="inflight"></div>
      </Fade>
    );
  }
}

export default Inflight;
