/** Get more easily comparable name for a torrent
 * Commonly, torrents will substitute a "." period for a space.
 *
 * Recommeneded to be used for filtering when searching for a torrent.
 */
export function GetTorrentSearchName(name: string): string {
  return name.replace(/\./g, " ").toLocaleLowerCase().trim();
}
