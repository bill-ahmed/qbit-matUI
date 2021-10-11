Running qBittorrent in a docker container during development. Allows for more complete and accurate testing, as opposed to the "mock server" originally used.

The folder structure is as follows:
- "config"
  - holds qbittorrent configuration files
- "downloads"
  - where all the torrent downloads are saved
- "www"
  - holds dev builds for both login and the main UI
