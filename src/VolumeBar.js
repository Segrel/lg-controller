import React, { Component } from 'react';
import { Form, InputGroup } from 'react-bootstrap';

class VolumeBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      volume: props.volume,
      sliding: false
    };
  }

  touchStarted() {
    this.setState({ sliding: true });
  }

  touchEnded() {
    this.setState({ sliding: false });
  }

  onVolumeChange(volume) {
    this.setState({ volume });
    this.props.onVolumeChange(volume);
  }

  render() {
    const {
      muted,
      onMuteChange,
      disabled,
      inflight
    } = this.props;

    let volume;
    if (this.state.sliding || inflight) {
      volume = this.state.volume;
    } else {
      volume = this.props.volume;
    }

    return (
        <Form>
          <Form.Group>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text onClick={() => !disabled && onMuteChange(!muted)}>
                  {muted ? '🔇' : '🔈'}
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                custom
                type="range"
                className="form-control"
                step="1"
                min="0"
                max="32"
                onTouchStart={() => this.touchStarted()}
                onTouchEnd={() => this.touchEnded()}
                onChange={(event) => this.onVolumeChange(event.target.value)}
                value={volume}
                disabled={disabled}
              />
              <InputGroup.Append>
                <InputGroup.Text>{volume}</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Form.Group>
        </Form>
      );
    }    
}

export default VolumeBar;
