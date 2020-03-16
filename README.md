# QbitWebUI

An alternative Web Interface to the original [qBittorrent Web UI](https://github.com/qbittorrent/qBittorrent). This interface is very slimmed down and contains the following features

* Adding torrents
* Deleting torrents
* Searching by name
* Sorting by different metrics (name, size, etc.)
* A fully material-themed UI
* ... More to come!

## Configuration
This app relies on a couple files to work properly. Under `src/assets/` there are two files: `http_config.json` and `http_config.prod.json`. During the production build, the former is replaced with the latter file. 

If you wish to configure your endpoints and other data for dev/prod, do so here.

## Running the App -- Development server
To install the dependencies, run `npm install` in both the root directory and the `mock_backend/` folder.

### Front-end:
1. Run `ng serve` for a dev server
2. Navigate to `http://localhost:4200/`

### Back-end
1. Navigate to `mock_backend/` directory (`cd mock_backend`)
2. Run `node index.js`

The app will automatically reload if you change any of the Angular source code.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Replacing existing qBittorrent Web UI
In order to use this version, first follow the instructions outlined [here (*)](https://github.com/qbittorrent/qBittorrent/wiki/Alternate-WebUI-usage).

Once you've completed that:

1. Build the production app (from build section)
2. Navigate to the `dist/` directory, and copy all files to your clipboard
3. Navigate to wherever you placed the `public`/`private` folder from (*)
4. Replace all the contents of the `private` folder with the contents of `dist/` from the project directoy

That's it!