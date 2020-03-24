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
    progress: number,
    dlspeed: number,
    upspeed: number,
    priority: number,
    num_seeds: number,
    num_leechs: number,
    num_incomplete: number,
    /**Unix timestamp of when torrent was completed */
    completion_on: number | undefined,
    ratio: number,
    eta: number,
    state: "forcedUP" | "error" | "pausedUP" | "pausedDL" | "queuedUP" | "queuedDL" | "uploading" | "stalledUP" | "checkingUP" | "checkingDL" | "downloading" | "stalledDL" | "metaDL",
    seq_dl: boolean,
    f_l_piece_prio: boolean,
    category: string,
    super_seeding: boolean,
    force_start: boolean
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
