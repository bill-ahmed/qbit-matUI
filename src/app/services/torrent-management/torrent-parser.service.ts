import { Injectable } from '@angular/core';
import { Buffer } from 'buffer';

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
  public async parseFile(torrent: File): Promise<void> {
    console.log("parsing...");

    //@ts-ignore -- ArrayBuffer very much does exist on Files...
    let array_buff = await torrent.arrayBuffer()
    let buff = Buffer.from(array_buff);      // Need to convert to a proper Buffer

    console.log(this.torrent_parser(buff))
  }
}
