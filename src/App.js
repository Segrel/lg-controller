import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import './App.css';
import TV from './tv';
import ErrorBar from './ErrorBar';
import Inflight from './Inflight';
import VolumeBar from './VolumeBar';
import PowerBar from './PowerBar';

class App extends Component {
  constructor(props) {
    super(props);
    this.tv = new TV({
      setId: '01',
      onError: (error) => this.setError(error),
      onStateChange: (state) => this.setState(state),
      onInFlightStatusChange: (inflight) => this.setState({ inflight }),
    });
    this.state = {
      powerOn: false,
      screenMute: false,
      volume: 0,
      audioMute: false,
      inflight: false,
      error: ''
    };
    this.errorTimeoutHandle = undefined;
  }

  setError(error) {
    clearTimeout(this.errorTimeoutHandle);
    this.errorTimeoutHandle = setTimeout(() => this.setState({ error: '' }), 3000);
    return this.setState({ error });
  }

  render() {
    const {
      powerOn,
      screenMute,
      volume,
      audioMute,
      inflight,
      error
    } = this.state;

    return (
      <Container className="text-center m-0 p-0">
        <ErrorBar className="fixed-top p-1" error={error} />

        <Inflight className="mt-4" inflight={inflight} />

        <Container className="controls position-absolute p-4">
          <VolumeBar
            volume={volume}
            onVolumeChange={(volume) => this.tv.setTargetState('kf', parseInt(volume, 10).toString(16))}
            muted={audioMute}
            onMuteChange={(muted) => this.tv.setTargetState('ke', muted ? '01' : '00')}
            inflight={inflight}
            disabled={!powerOn} />

          <PowerBar
            powerOn={powerOn}
            onPowerChange={(powerOn) => this.tv.setTargetState('ka', powerOn ? '01' : '00')}
            muted={screenMute}
            onMuteChange={(muted) => this.tv.setTargetState('kd', muted ? '01' : '00')} />
        </Container>
      </Container>
    );
  }
}

export default App;
