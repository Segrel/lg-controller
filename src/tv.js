class TV {
  constructor({ setId, onError, onStateChange, onInFlightStatusChange }) {
    this.setId = setId;
    this.onError = onError;
    this.onStateChange = onStateChange;
    this.onInFlightStatusChange = onInFlightStatusChange;

    this.inflight = false;
    this.targetState = {};
    this.commandQueue = [];
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

  updateState({ command, status, value }) {
    if (status !== 'OK') {
      const errorCode = parseInt(value, 16);
      let error = `${status}: ${value}`;
      if (status === 'NG') {
        /* eslint-disable default-case,no-fallthrough */
        switch (errorCode) {
          case 1: error = 'Illegal Code.';
          case 2: error = 'Not supported.';
          case 3: error = 'Too fast, please wait.';
        }
        /* eslint-enable default-case,no-fallthrough */
      }
      return this.onError(error);
    }

    if (command === 'a') {
      const powerOn = Boolean(parseInt(value, 16));
      return this.onStateChange({ powerOn });
    }

    if (command === 'd') {
      const screenMute = Boolean(parseInt(value, 16));
      return this.onStateChange({ screenMute });
    }

    if (command === 'e') {
      const audioMute = Boolean(parseInt(value, 16));
      return this.onStateChange({ audioMute });
    }

    if (command === 'f') {
      return this.onStateChange({ volume: parseInt(value, 16) });
    }

    if (command === 'h') {
      return this.onStateChange({ brightness: parseInt(value, 16) });
    }
  }

  setTargetState(command, value) {
    const commandInQueue = Boolean(this.commandQueue.indexOf(command) !== -1);

    if (commandInQueue && this.targetState[command] === value) {
      return;
    }
    if (commandInQueue && value === 'ff') {
      return;
    }

    this.targetState[command] = value;

    if (!commandInQueue) {
      this.commandQueue.push(command);
    }

    this.pushState();
  }

  pushState() {
    if (this.inflight) {
      return;
    }

    const command = this.commandQueue.shift();
    const body = `${command} ${this.setId} ${this.targetState[command]}\r`;

    this.inflight = true;
    this.onInFlightStatusChange(this.inflight);
    fetch('/command', { method: 'POST', body })
      .then(response => {
        if (!response.ok) {
          throw new Error("Something went wrong.");
        }
        return response;
      })
      .then(response => response.text())
      .then(this.parseResponse)
      .then(response => this.updateState(response))
      .catch(error => this.onError(error.message))
      .finally(() => {
        this.inflight = false;
        if (this.commandQueue.length) {
          this.pushState();
        } else {
          this.onInFlightStatusChange(this.inflight);
        }
      });
  }
}

export default TV;
