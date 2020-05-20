/** Get more easily comparable name for a torrent
 * Commonly, torrents will substitute a "." period for a space.
 *
 * Recommeneded to be used for filtering when searching for a torrent.
 */
export function GetTorrentSearchName(name: string): string {
  return name.replace(/\./g, " ").toLocaleLowerCase().trim();
}

/** The default location a user chooses to store torrents
 * If the location cannot be found, empty string is returned instead
 * @returns The defualt download location for torrents, as defined
 * by the user's preferences
 */
export function GetDefaultSaveLocation(): string {
  let save_location: string;
  let pref = localStorage.getItem('preferences');

  if(pref) {
    save_location = JSON.parse(pref).save_path;
  }

  return save_location || "";
}
