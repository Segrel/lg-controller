import React, { Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap';

class PowerBar extends Component {
    render() {
      const { powerOn, muted, onPowerChange, onMuteChange } = this.props;

      return (
        <Row>
          <Col>
            <Button
              variant={powerOn ? 'primary' : 'secondary'}
              size="lg"
              onClick={() => onPowerChange(false)}>
              Off
            </Button>
          </Col>
          <Col>
            <Button
              variant={powerOn ? 'secondary' : 'primary'}
              size="lg"
              onClick={() => onPowerChange(true)}>
              On
            </Button>
          </Col>
          <Col>
            <Button
              variant={powerOn ? 'primary' : 'secondary'}
              size="lg"
              disabled={!powerOn}
              onClick={() => onMuteChange(!muted)}>
              {muted ? 'Picture' : 'Blank'}
            </Button>
          </Col>
        </Row>
      );
    }
}

export default PowerBar;
