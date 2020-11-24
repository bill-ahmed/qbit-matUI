import { Injectable } from '@angular/core';
import { Buffer } from 'buffer';
import { ParsedTorrent } from 'src/utils/Interfaces';
import { FileSystemService, SerializedNode } from '../file-system/file-system.service';
import DirectoryNode from '../file-system/FileSystemNodes/DirectoryNode';

@Injectable({
  providedIn: 'root'
})
export class TorrentParserService {

  private torrent_parser: (arg: any) => ParsedTorrent;

  constructor(private fs: FileSystemService) {
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

    console.log('Started parsing...')
    let result = await Promise.all(queue);
    console.log('Finished parsing!')

    return result;
  }

  public async GetSerializedTorrentsFromParsedFile(file: ParsedTorrent): Promise<SerializedNode[]> {
    let res: SerializedNode[] = []
    if(file.files) {
      file.files.forEach(elem => {
        res.push({
          name: elem.name,
          path: elem.path,
          size: elem.length,
          type: 'File'
        });
      })
    }
    return res;
  }

  /** Get a serialized  filesystem from parsed torrents */
  public async GetSerializedTorrentFromMultipleParsedFiles(files: ParsedTorrent[]): Promise<SerializedNode[]> {
    let root = new DirectoryNode({value: "", skipNameValidation: true});

    // Guess what the delimiter is lmao
    let delimiter = files.length === 0 ? "/" : FileSystemService.DetectFileDelimiter(files[0].files[0].path);

    // Keep track of a list of all the files in torrent (flattened list)
    let res: SerializedNode[] = []
    let serialized_fs: SerializedNode[];

    await files.forEach(async file => {
      let nodes = await this.GetSerializedTorrentsFromParsedFile(file);
      if(nodes.length > 0) { res.push(...nodes) }
    })

    console.log('Constructing filesystem...');

    // Construct a file system that represents the list of paths
    await this.fs.populateFileSystemWithAdvancedOptions(res, root, delimiter);
    serialized_fs = await this.fs.SerializeFileSystem(root);

    console.log("Done getting serlized torrents")
    return serialized_fs;
  }

}
