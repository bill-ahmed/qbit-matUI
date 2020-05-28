export interface HttpConfigType{
    endpoints: {
        root: string,
        torrentList: string
    }
}

export interface CookieInfoType {
    SIDKey: string
}

/** An interface to represent a torrent. Taken from: https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-Documentation#get-torrent-list */
export interface Torrent {
    hash: string,
    name: string,
    size: number,
    total_size: number,
    downloaded: number,
    uploaded: number,
    progress: number,
    dlspeed: number,
    upspeed: number,
    priority: number,
    num_seeds: number,
    num_leechs: number,
    num_incomplete: number,
    /**Unix timestamp of when torrent was completed */
    completion_on: number | undefined,
    added_on: number,
    /**Unix timestamp of when torrent was last active */
    last_activity: number,
    /**Unix timestamp of how long this torrent has been active */
    time_active: number,
    ratio: number,
    /** Estimated time until torrent finishes, in seconds */
    eta: number,
    state: "forcedUP" | "error" | "pausedUP" | "pausedDL" |
    "queuedUP" | "queuedDL" | "uploading" | "stalledUP" |
    "checkingUP" | "checkingDL" | "downloading" | "stalledDL" |
    "metaDL" | "moving" | "forcedDL" | "unknown",
    seq_dl: boolean,
    f_l_piece_prio: boolean,
    category: string,
    super_seeding: boolean,
    force_start: boolean,
    save_path: string
}

/** Global states of server, such as global download, upload, etc. */
export interface GlobalTransferInfo {
    /** Total size of data ever downloaded */
    alltime_dl: number,
    /** Total size of data ever downloaded */
    alltime_ul: number,
    /** Global download rate (bytes/s) */
    dl_info_speed: number,
    /** Data downloaded this session (bytes) */
    dl_info_data: number,
    /** Global upload rate (bytes/s) */
    up_info_speed: number,
    /** Data uploaded this session (bytes) */
    up_info_data: number,
    /** Download rate limit (bytes/s) */
    dl_rate_limit: number,
    /** Upload rate limit (bytes/s) */
    up_rate_limit: number,
    /** DHT nodes connected to */
    dht_nodes: number,
    connection_status: "connected" | "firewalled" | "disconnected",
    /** Total free space on disk (bytes) */
    free_space_on_disk: number,
    total_peer_connections: number,

}

/** Response when requesting torrent data from server */
export interface MainData {
    rid: number,
    full_update: boolean,
    torrents: Torrent[],
    /** List of hashes of torrents removed since last request */
    torrents_removed: [ string ],
    /** List of categories added since last request */
    categories: [ string ],
    categories_removed: [ string ],
    queueing: boolean,
    server_state: GlobalTransferInfo
}

/** The contents of a torrent */
export interface TorrentContents {
  /** File name (including relative path) */
  name: string,
  /** File size (bytes) */
  size: number,
  progress: number,
  /** 0 = Do not download; 1 = normal; 6 = high; 7 = maximal priority */
  priority: 0 | 1 | 6 | 7,
  /** True if file is seeding/complete */
  is_seed: boolean,
  piece_range: number[],
  /** Percentage of file pieces currently available */
  availability: number,
}

/** Type of network connections a user can have */
export type NetworkType = 'slow-2g' | '2g' | '3g' | '4g';

/** The general info on the user's current internet connection.
 * More details at: https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation
 */
export interface NetworkConnection {
    effectiveType: NetworkType,
    /** The estimated round-trip time of current connection; rounded to nearest 25 milliseconds */
    rtt: number,
    /** Estimated download bandwith, in megabits per second. */
    downling: number,
    /** Whether the user has enabled a reduced data option */
    saveData: boolean
}

/** Subset of application preferences for qBittorrent. */
export interface UserPreferences extends DownloadSettings {
  autorun_enabled: boolean,
  autorun_program: string,
  listen_port: number,
  /** Currently selected language */
  locale: string,
  max_connec: number,
  max_connec_per_torrent: number,
  max_uploads_per_torrent: number,
  queueing_enabled: boolean,
  web_ui_options: WebUISettings,
}

/** All Web-UI related settings. */
export interface WebUISettings {
  dark_mode_enabled?: boolean,
  torrent_table?: {
    paginate: boolean,
    default_items_per_page: number,
    showFirstAndLastOptions: boolean
  },
  file_system?: {
    delimiter: string
  },
  network: {
    auto_refresh: boolean,
    refresh_interval: number
  }
}

/** Various download-related preferences
 * a user can have with qBittorrent
 */
export interface DownloadSettings {
  max_active_downloads: number,
  max_active_torrents: number,
  max_active_uploads: number,
  /** Default save path for torrents */
  save_path: string,
  scan_dirs: string[],
  /** Path for incomplete torrents */
  temp_path: string,
}

/** Various speed-related settings. */
export interface SpeedSettings {
  /** Global download limit in KiB/s (-1 implies no limit) */
  dl_limit: number,
  /** Global upload limit in KiB/s (-1 implies no limit) */
  up_limit: number,
}

export interface QbittorrentBuildInfo {
  appVersion: string,
  apiVersion: string
}
