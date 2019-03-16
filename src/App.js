import React, { Component } from 'react';
import { Container, Row, Col, Alert, Form, InputGroup, Button, Fade } from 'react-bootstrap';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.setId = '01';
    this.targetState = {};
    this.commandQueue = [];
    this.inflight = false;
    this.state = { isOn: false, volume: 0, audioMute: false, screenMute: false, error: '' };
    this.pushStateTimer = false;
    this.pushStateTimerHandle = undefined;
    this.errorTimeout = undefined;
  }

  componentDidMount() {
    this.setTargetState('ka', 'ff');
  }

  parseResponse(ack) {
    const parts = ack.split(' ');
    if (3 !== parts.length) {
      throw new Error(ack);
    }

    const command = parts[0];
    const setId = parts[1];

    const statusDataEnd = parts[2];
    const status = statusDataEnd.substring(0, 2);
    const value = statusDataEnd.substring(2, statusDataEnd.indexOf('x'));

    return { command, setId, status, value };
  }

  setError(error) {
    clearTimeout(this.errorTimeout);
    this.errorTimeout = setTimeout(() => this.setState({ error: '' }), 3000);

    return this.setState({ error });
  }

  updateState({ command, status, value }) {
    if (status !== 'OK') {
      const errorCode = parseInt(value, 16);
      let error = `${status}: ${value}`;
      if (status === 'NG') {
        switch (errorCode) {
          case 0x01: error = 'Illegal Code.';
          case 0x02: error = 'Not supported.';
          case 0x03: error = 'Too fast, please wait.';
        }
      }
      return this.setError(error);
    }

    if (command === 'f') {
      return this.setState({ volume: parseInt(value, 16) });
    }

    if (command === 'a') {
      const isOn = Boolean(parseInt(value, 16));
      if (isOn && !this.state.volume) {
        setTimeout(() => this.setTargetState('kf', 'ff'), 10000);
      }
      return this.setState({ isOn });
    }

    if (command === 'd') {
      const screenMute = Boolean(parseInt(value, 16));
      return this.setState({ screenMute });
    }

    if (command === 'e') {
      const audioMute = Boolean(parseInt(value, 16));
      return this.setState({ audioMute });
    }
  }

  setTargetState(command, value) {
    const commandInQueue = Boolean(this.commandQueue.indexOf(command) !== -1);

    if (this.targetState[command] === value) {
      return;
    }
    this.targetState[command] = value;

    if (commandInQueue && value === 'ff') {
      return;
    }
    if (!commandInQueue) {
      this.commandQueue.push(command);
    }

    if (!this.pushStateTimer) {
      this.pushStateTimer = true;
      this.pushStateTimerHandle = setTimeout(() => {
        this.pushStateTimer = false;
        this.pushState();
      }, 500);
    }
  }

  pushState() {
    if (this.inflight) {
      if (!this.pushStateTimer) {
        this.pushStateTimer = true;
        this.pushStateTimerHandle = setTimeout(() => {
          this.pushStateTimer = false;
          this.pushState();
        }, 500);
      }
      return;
    }
    this.inflight = true;

    if (this.commandQueue.length === 0) {
      return;
    }
    const command = this.commandQueue.shift();
    const body = `${command} ${this.setId} ${this.targetState[command]}\r`;

    fetch('/command', { method: 'POST', body })
      .then(response => {
        if (!response.ok) {
          throw new Error("Something went wrong.");
        }
        return response;
      })
      .then(response => response.text())
      .then(this.parseResponse)
      .then((response) => this.updateState(response))
      .catch(error => this.setError(error.message))
      .finally(() => this.inflight = false);
  }

  render() {
    const { isOn, volume, audioMute, screenMute, error } = this.state;

    return (
      <Container className="App position-absolute mb-5">
        <Row className="mt-4 fixed-top error-row">
          <Col>
            <Fade in={error !== ''}>
              <div><Alert variant="danger">{error}</Alert></div>
            </Fade>
          </Col>
        </Row>

        <Form className="my-4">
          <Form.Group>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text onClick={() => this.setTargetState('ke', audioMute ? '00' : '01')}>{audioMute ? '🔇' : '🔈'}</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control disabled={!isOn} type="range" className="custom-range" onChange={(event) => this.setTargetState('kf', parseInt(event.target.value, 10).toString(16))} min="0" max="32" step="1" value={volume} />
              <InputGroup.Append>
                <InputGroup.Text>{volume}</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Form.Group>
        </Form>

        <Row>
          <Col>
            <Button variant={isOn ? 'primary' : 'secondary'} size="lg" onClick={() => this.setTargetState('ka', '00')}>
              Off
            </Button>
          </Col>
          <Col>
            <Button variant={isOn ? 'secondary' : 'primary'} size="lg" onClick={() => this.setTargetState('ka', '01')}>
              On
            </Button>
          </Col>
          <Col>
            <Button variant={isOn ? 'primary' : 'secondary'} size="lg" disabled={!isOn} onClick={() => this.setTargetState('kd', screenMute ? '00' : '01')}>
              {screenMute ? 'Picture' : 'Blank'}
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
