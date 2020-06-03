import { Injectable } from '@angular/core';
import { Buffer } from 'buffer';
import { ParsedTorrent } from 'src/utils/Interfaces';
import { SerializedNode } from '../file-system/file-system.service';

@Injectable({
  providedIn: 'root'
})
export class TorrentParserService {

  private torrent_parser: (arg: any) => ParsedTorrent;

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
  public async ParseFile(torrent: FileList): Promise<ParsedTorrent> {

    //@ts-ignore -- ArrayBuffer very much does exist on Files...
    let array_buff = await torrent.arrayBuffer()
    let buff = Buffer.from(array_buff);      // Need to convert to a proper Buffer

    return this.torrent_parser(buff);
  }

  public async ParseMultipleFiles(torrents: FileList[]): Promise<ParsedTorrent[]> {
    let queue = [];

    for(const tor of torrents) {
      queue.push(this.ParseFile(tor));
    }

    return await Promise.all(queue);
  }

  public async GetSerializedTorrentsFromParsedFile(file: ParsedTorrent): Promise<SerializedNode[]> {
    let res = []
    if(file.files) {
      file.files.forEach(elem => {
        res.push({
          name: elem.name,
          path: elem.path,
          size: elem.length
        });
      })
    }
    return res;
  }

  public async GetSerializedTorrentFromMultipleParsedFiles(files: ParsedTorrent[]): Promise<SerializedNode[]> {
    let res = []

    await files.forEach(async file => {
      let nodes = await this.GetSerializedTorrentsFromParsedFile(file);
      if(nodes.length > 0) { res.push(...nodes) }
    })

    return res;
  }

}
