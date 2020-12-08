# qBit MatUI <br/>[![Build Status](https://travis-ci.org/bill-ahmed/qbit-material-WebUI.svg?branch=master)](https://travis-ci.org/bill-ahmed/qbit-material-WebUI)

<img src="builds/images/home_page_dark_shadow.jpg" alt="Home Page"/>

<br/>
<br/>

A material-themed interface to the original [qBittorrent Web UI](https://github.com/qbittorrent/qBittorrent). This interface is more slimmed down, although still contains several features such as:

* Bulk edit (pause, resume, delete, prioritize, and more)
* Sorting by different metrics (name, size, date completed, etc.)
* See torrent contents _before_ downloading
* File system navigation (choose where to save a torrent, create sub-folders, etc.)
* Manage local & qBittorrent preferences
* A fully material-themed UI (Light & Dark themes)
* ... and more!

## Demo!
A live demo is available here: https://qbit-material-webui-demo.herokuapp.com/.

## Installation -- Replacing your existing qBittorrent Web UI
This app is tested with **v4.1.5** and higher of qBittorrent, any lower version are not guaranteed to work.

1. Take a production-ready build from [releases](https://github.com/bill-ahmed/qbit-material-WebUI/releases), or [build it yourself](#build)
2. Extract the files into any folder
3. In qBittorrent, under Tools > Options > Web UI > Use alternative Web UI, set the file location as the folder you created in Step 2.
4. Done!

-----

## Development
This app relies on a couple files to work properly.

### General Config
Under `src/assets/` there are two files: `config.json` and `config.prod.json`. This will store general configuration, such as the delimeter used when parsing file paths (Unix vs. Windows).

### HTTP Config
Under `src/assets/` there are two files: `http_config.json` and `http_config.prod.json`. During the production build, the former is replaced with the latter file. 

If you wish to configure your endpoints and other data for dev/prod, do so here.

## Running the App
To install the dependencies, run `npm install` in both the root directory and the `mock_backend/` folder.

### Back-end
1. Navigate to `mock_backend` directory
2. Run `node index.js`

### Front-end:
1. Run `ng serve` for a dev server
2. Navigate to `http://localhost:4200/`
3. Username: `admin`; Password: `password`; This can be changed under `mock_backend/config.json`

To run the login page standalone, do: `ng serve login` and navigate to `http://localhost:4200/`.

The app will automatically reload if you make changes to any of the Angular source code.

-----

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build. 

To get a build for the login page, run `ng build --project="login"`, and provide the `--prod` flag for a production build.
