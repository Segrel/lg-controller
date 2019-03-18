import React, { Component } from 'react';
import { Row, Col, Alert, Fade } from 'react-bootstrap';

class ErrorBar extends Component {
  render() {
    const { error } = this.props;

    return (
      <Row className={this.props.className}>
        <Fade in={error !== ''}>
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Fade>
      </Row>  
    );
  }
}

export default ErrorBar;
