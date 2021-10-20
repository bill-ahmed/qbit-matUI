import { Torrent } from "./Interfaces";

const MOBILE_USER_AGENT_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

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

function isTorrentPrimaryAction(tor: Torrent): boolean {
  return tor.state === 'downloading';
}

/** Determine if torrent is in a error state */
function isTorrentError(tor: Torrent): boolean {
  let errors = ['missingFiles', 'error', 'unknown'];
  return errors.includes(tor.state);
}

function isTorrentWarning(tor: Torrent): boolean {
  let warnings = ['moving', 'checkingDL'];
  return warnings.includes(tor.state);
}

export function getClassForStatus(torrent: Torrent): string {
  let root = 'torrent-status '
  let suffix = isTorrentPrimaryAction(torrent) ? 'primary' : isTorrentError(torrent) ? 'danger' : isTorrentWarning(torrent) ? 'warning' : 'info'

  return root + suffix;
}

/** True iff user is on a mobile device. Not perfect as
 * some browsers may want to force desktop view, which is fine.
 */
export function IsMobileUser(): boolean {
  return MOBILE_USER_AGENT_REGEX.test(navigator.userAgent);
}


/**
 * Simple object check.
 */
function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 *
 * @description This was taken from a stackoverflow article :P
 * @see https://stackoverflow.com/a/34749873
 */
export function MergeDeep(target: any, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        MergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return MergeDeep(target, ...sources);
}
