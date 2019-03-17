import React, { Component } from 'react';
import { Row, Col, Alert, Fade } from 'react-bootstrap';

class ErrorBar extends Component {
  render() {
    const { error } = this.props;

    return (
      <Row className="mt-4 mx-1 fixed-top text-center">
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
