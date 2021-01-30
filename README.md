# Gallery BDE Polytech Montpellier

## Build the project

The react components must be built in order to be served by the server. To build, you must use the command `npm run build`.

## Serve the project

The server will serve files in the `build` directory (which is populated with the `npm run build` command) and the files in the `photos/albums` directory.
To run the server use must use the command `npm run start`.

## Development

During the development, you should edit the `baseURL` in the `src/settings.js` file (setting it to `http://locahost:5000` should be sufficient) then run the server `npm start` et run watcher for front `npm run start:front`.
