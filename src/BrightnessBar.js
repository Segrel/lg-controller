import React, { Component } from 'react';
import { Form, InputGroup } from 'react-bootstrap';

class BrightnessBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brightness: props.brightness,
      sliding: false
    };
  }

  touchStarted() {
    this.setState({ sliding: true });
  }

  touchEnded() {
    this.setState({ sliding: false });
  }

  onBrightnessChange(brightness) {
    this.setState({ brightness });
    this.props.onBrightnessChange(brightness);
  }

  render() {
    const {
      disabled,
      inflight
    } = this.props;

    let brightness;
    if (this.state.sliding || inflight) {
      brightness = this.state.brightness;
    } else {
      brightness = this.props.brightness;
    }

    return (
        <Form className="my-4">
          <Form.Group>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  🔆
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                className="custom-range"
                type="range"
                step="1"
                min="0"
                max="100"
                onTouchStart={() => this.touchStarted()}
                onTouchEnd={() => this.touchEnded()}
                onChange={(event) => this.onBrightnessChange(event.target.value)}
                value={brightness}
                disabled={disabled}
              />
              <InputGroup.Append>
                <InputGroup.Text>{brightness}</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Form.Group>
        </Form>
      );
    }    
}

export default BrightnessBar;
