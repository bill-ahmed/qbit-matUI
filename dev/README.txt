Running qBittorrent in a docker container during development. Allows for more complete and accurate testing, as opposed to the "mock server" originally used.

The folder structure is as follows:
- "config"
  - holds qbittorrent configuration files
- "downloads"
  - where all the torrent downloads are saved
- "www"
  - holds dev builds for both login and the main UI


To setup the dev env:
1. Go to "dev" folder
2. Run: docker-compose up -d
3. Open up the default web ui and set desired username/password
4. Under Web UI settings, set the path to "/www"
5. Go to project root
6. Run: npm run dev
7. Go to http://localhost:8090

Note: If you make any changes to the source code, you will have to hard-reload the page each time (Ctrl + Shift + R on Windows).
