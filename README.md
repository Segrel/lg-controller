# lg-controller

WiFi-connected serial port LG television controller with mobile web frontend.

For a list of LG RS-232 control commands, check your user manual or find one [online](https://www.lg.com/us/commercial/documents/47wv30bs-owner-manual.pdf).

## Setup

You need to put Wifi credentials to `Server/env.h`:
```
#define WIFI_SSID "ssid"
#define WIFI_PASSWORD "pass"
```

You also must build the static assets, see scripts below.

## Usage

On a Bonjour enabled environment, just navigate your browser to `lg-controller.local`. Otherwise check Serial output of the board for IP. Web UI is home screen icon compatible for mobile.

## Available Scripts

In the project directory, you can run:

### `npm run fakeserver`

Starts up `FakeServer` with nodemon. FakeServer currently only supports certain commands and should be considered a template to build from, not a complete implementation.

### `npm run build-dist`

Compiles the production bundle and generates the static UI assets under `Server`.

This command might come in handy as VSCode Arduino `prebuild` command.

### `npm run dist`

Generates the static UI assets under `Server`.

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
