import { TORRENT_TABLE_COLUMNS } from 'src/app/services/app/application-config.service';

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
    dl_speed_avg: number,
    upspeed: number,
    up_speed_avg: number,
    up_limit: number,
    dl_limit: number,
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

    /** True if alternative speed limits are enabled */
    use_alt_speed_limits: boolean
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

/** Represent a parsed torrent. This is the type of data we get
 * by parsing a torrent file, magnet URL, etc.
 */
export interface ParsedTorrent {
  /** Only guaranteed property to exist */
  infoHash: string,
  announce?: string[]
  name?: string

  /** Date this torrent was created */
  created?: Date

  /** Size of entire torrent, in bytes */
  length?: number

  files?: ParsedTorrentFile[]
  pieces?: string[]
  private?: boolean
}

/** Represent a file that can exist in a parsed torrent */
export interface ParsedTorrentFile {
  name: string

  /** Size of this file, in bytes */
  length: number

  /** File path, un Unix-style delimiter */
  path: string
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
    downlink: number,
    /** Whether the user has enabled a reduced data option */
    saveData: boolean
}

/** Subset of application preferences for qBittorrent. */
export interface UserPreferences extends DownloadSettings, SpeedSettings {
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

/** Various download-related preferences
 * a user can have with qBittorrent
 */
export interface DownloadSettings {
  /** Whether or not to respect max active downloads/torrents/uploads/etc. */
  queueing_enabled: boolean,
  max_active_downloads: number,
  max_active_torrents: number,
  max_active_uploads: number,
  /** Default save path for torrents */
  save_path: string,
  scan_dirs: string[],

  /** True if folder for incomplete torrents is enabled */
  temp_path_enabled: boolean,
  /** Path for incomplete torrents */
  temp_path: string,

  /** True if a subfolder should be created when adding a torrent */
  create_subfolder_enabled: boolean,

  /** True if disk space should be pre-allocated for all files */
  preallocate_all: boolean,

  /** True if ".!qB" should be appended to incomplete files */
  incomplete_files_ext: boolean,

  /** True if torrents should be added in a Paused state */
  start_paused_enabled: boolean,
}

/** Various speed-related settings. */
export interface SpeedSettings {
  /** Global download limit in KiB/s (0 or -1 implies no limit) */
  dl_limit: number,
  /** Global upload limit in KiB/s (0 or -1 implies no limit) */
  up_limit: number,

  /** Alternative global download speed limit in KiB/s */
  alt_dl_limit: number,

  /**	Alternative global upload speed limit in KiB/s */
  alt_up_limit: number,

  /** True if alternative limits should be applied according to schedule */
  scheduler_enabled: boolean,

  /** Scheduler starting hour */
  schedule_from_hour: number,

  /** Scheduler starting minute */
  schedule_from_min: number,

  /** Scheduler ending hour */
  schedule_to_hour: number,

  /** Scheduler ending minute */
  schedule_to_min: number,

  /** Scheduler days. See possible values in Web UI API */
  scheduler_days: number
}

export interface QbittorrentBuildInfo {
  appVersion: string,
  apiVersion: string
}

/** All Web-UI related settings. */
export interface WebUISettings {
  dark_mode_enabled?: boolean,
  torrent_table?: WebUITorrentTableSettings
  file_system?: WebUIFileSystemSettings
  network?: WebUINetworkSettings
  upload_torrents?: WebUIUploadingSettings
  notifications?: WebUINotificationSettings;
}

export interface WebUIUploadingSettings {
  /** Whether to show the files inside a torrent when uploading a .torrent file */
  show_parsed_torrents_from_file: boolean,
  /** Whether to show the files inside a torrent when adding magnet URLs */
  show_parsed_torrents_from_magnet: boolean
}

export interface WebUINetworkSettings {
  auto_refresh: boolean,
  refresh_interval: number
}

export interface WebUIFileSystemSettings {
  delimiter: string,
  use_alt_delimiter: boolean
}

export interface WebUITorrentTableSettings {
  default_sort_order: {
    column_name: TORRENT_TABLE_COLUMNS,
    order: 'asc' | 'desc'
  },
  columns_to_show: string[]
}

export interface WebUINotificationSettings {
  show_snack_notifications: boolean,
}
