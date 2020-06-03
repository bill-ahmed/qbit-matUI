import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TorrentParserService {

  private torrent_parser: (arg: any) => any;

  constructor() {
    /**
     * DO NOT CHECK FOR TS ERRORS with parseTorrent.
     * This function is loadind via a script tag in index.html.
     * It was bundled using browserify (http://browserify.org/).
     */
    //@ts-ignore
    this.torrent_parser = window.parseTorrent
  }

  /** Given a torrent file, parse its contents. */
  public parseFile(torrent: File): any {

  }
}
