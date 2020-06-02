var GetRandomInt = require('./utils.js').GetRandomInt;

// Maximum upload/download speeds for mock data
const MIN_SPEED = 0;
const MAX_SPEED = 90000000;

// Max/Min file sizes possible
const MIN_FILE_SIZE = 0;
const MAX_FILE_SIZE = 900000000000;

// Min and max ETA seconds
const MIN_ETA_SIZE = 0;
const MAX_ETA_SIZE = 28800; // 8 hours

// Some possible states a torrent can be in
const torrent_states = [
  'forcedUP', 'error', 'pausedUP', 'pausedDL', 'queuedUP', 'uploading',
  'stalledUP', 'downloading', 'stalledDL'
];

var RID = -1;    // For /sync/maindata endpoint
var states_length = torrent_states.length - 1;

function getRandomId() {
    return Math.random().toString(36).substring(15);
}

/**Mock data for /sync/maindata endpoint */
function GetMainData(){
    RID += 1;
    let result =
        {
            "categories": {},
            "full_update": true,
            "rid": RID,
            "server_state": {
                "alltime_dl": 134924863044,
                "alltime_ul": 169885275053,
                "average_time_queue": 3787,
                "connection_status": "connected",
                "dht_nodes": 393,
                "dl_info_data": GetRandomInt(MIN_FILE_SIZE, MAX_FILE_SIZE),
                "dl_info_speed": GetRandomInt(MIN_SPEED, MAX_SPEED),
                "dl_rate_limit": 0,
                "free_space_on_disk": GetRandomInt(MIN_FILE_SIZE, MAX_FILE_SIZE * 100),
                "global_ratio": "1.25",
                "queued_io_jobs": 0,
                "queueing": true,
                "read_cache_hits": "26.34",
                "read_cache_overload": "0",
                "refresh_interval": 1500,
                "total_buffers_size": 66060288,
                "total_peer_connections": 10,
                "total_queued_size": 0,
                "total_wasted_session": 0,
                "up_info_data": GetRandomInt(MIN_FILE_SIZE, MAX_FILE_SIZE),
                "up_info_speed": GetRandomInt(MIN_SPEED, MAX_SPEED),
                "up_rate_limit": 0,
                "use_alt_speed_limits": false,
                "write_cache_overload": "0"
            },
            "torrents_removed": ["0daea5cece5"],
            "torrents": {
                "03b82ec41283e57ffb5a284e9a7773199dddc72a": {
                    "added_on": 1561931538,
                    "amount_left": 0,
                    "auto_tmm": false,
                    "category": "",
                    "completed": 6211419,
                    "completion_on": 18500,
                    "dl_limit": -1,
                    "dlspeed": GetRandomInt(MIN_SPEED, MAX_SPEED),
                    "downloaded": 7262278,
                    "downloaded_session": 0,
                    "eta": 8640000,
                    "f_l_piece_prio": false,
                    "force_start": true,
                    "last_activity": 1583846813,
                    "magnet_uri": "magnet #0",
                    "max_ratio": -1,
                    "max_seeding_time": -1,
                    "name": "The Quick Brown Fox",
                    "num_complete": 33,
                    "num_incomplete": 1,
                    "num_leechs": 0,
                    "num_seeds": 0,
                    "priority": 0,
                    "progress": Math.random(),
                    "ratio": 0.2930033799312006,
                    "ratio_limit": -2,
                    "save_path": "D:/",
                    "seeding_time_limit": -2,
                    "seen_complete": 1583845906,
                    "seq_dl": false,
                    "size": GetRandomInt(MIN_FILE_SIZE, MAX_FILE_SIZE),
                    "state": torrent_states[GetRandomInt(0, states_length)],
                    "super_seeding": false,
                    "tags": "",
                    "time_active": 5328405,
                    "total_size": GetRandomInt(MIN_FILE_SIZE, MAX_FILE_SIZE),
                    "tracker": "some tracker #0",
                    "up_limit": -1,
                    "uploaded": 2127872,
                    "uploaded_session": 0,
                    "upspeed": GetRandomInt(MIN_SPEED, MAX_SPEED)
                },
                "0daea5cece5": {
                    "added_on": 1574566015,
                    "amount_left": 0,
                    "auto_tmm": false,
                    "category": "",
                    "completed": 209869298,
                    "completion_on": 18000,
                    "dl_limit": -1,
                    "dlspeed": GetRandomInt(MIN_SPEED, MAX_SPEED),
                    "downloaded": 210629655,
                    "downloaded_session": 0,
                    "eta": GetRandomInt(MIN_ETA_SIZE, MAX_ETA_SIZE),
                    "f_l_piece_prio": false,
                    "force_start": true,
                    "last_activity": 1583690488,
                    "magnet_uri": "magnet_uri",
                    "max_ratio": -1,
                    "max_seeding_time": -1,
                    "name": "Some.show.#1.with.super.loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong name",
                    "num_complete": 18,
                    "num_incomplete": 1,
                    "num_leechs": 0,
                    "num_seeds": 0,
                    "priority": 0,
                    "progress": Math.random(),
                    "ratio": 1.0442750048657679,
                    "ratio_limit": -2,
                    "save_path": "A:/Movies & TV/Some show/",
                    "seeding_time_limit": -2,
                    "seen_complete": 1580860752,
                    "seq_dl": false,
                    "size": GetRandomInt(MIN_FILE_SIZE, MAX_FILE_SIZE),
                    "state": torrent_states[GetRandomInt(0, states_length)],
                    "super_seeding": false,
                    "tags": "",
                    "time_active": 718637,
                    "total_size": GetRandomInt(MIN_FILE_SIZE, MAX_FILE_SIZE),
                    "tracker": "https some tracker",
                    "up_limit": -1,
                    "uploaded": 219955284,
                    "uploaded_session": 0,
                    "upspeed": GetRandomInt(MIN_SPEED, MAX_SPEED)
                },
                "0f4eefe81227d7211b31a500144fe6a48b5b7d46": {
                    "added_on": 1574566016,
                    "amount_left": 0,
                    "auto_tmm": false,
                    "category": "",
                    "completed": 310964698,
                    "completion_on": 1574566096,
                    "dl_limit": -1,
                    "dlspeed": GetRandomInt(MIN_SPEED, MAX_SPEED),
                    "downloaded": 311199215,
                    "downloaded_session": 0,
                    "eta": GetRandomInt(MIN_ETA_SIZE, MAX_ETA_SIZE),
                    "f_l_piece_prio": false,
                    "force_start": true,
                    "last_activity": 1583690567,
                    "magnet_uri": "magnet",
                    "max_ratio": -1,
                    "max_seeding_time": -1,
                    "name": "Another show #2 with decently-sized name",
                    "num_complete": 12,
                    "num_incomplete": 1,
                    "num_leechs": 0,
                    "num_seeds": 0,
                    "priority": 0,
                    "progress": Math.random(),
                    "ratio": 0.5514229655110152,
                    "ratio_limit": -2,
                    "save_path": "B:/TV/Some show #2/",
                    "seeding_time_limit": -2,
                    "seen_complete": 1583660691,
                    "seq_dl": false,
                    "size": GetRandomInt(MIN_FILE_SIZE, MAX_FILE_SIZE),
                    "state": torrent_states[GetRandomInt(0, states_length)],
                    "super_seeding": false,
                    "tags": "",
                    "time_active": 876906,
                    "total_size": GetRandomInt(MIN_FILE_SIZE, MAX_FILE_SIZE),
                    "tracker": "https tracker",
                    "up_limit": -1,
                    "uploaded": 171602394,
                    "uploaded_session": 0,
                    "upspeed": GetRandomInt(MIN_SPEED, MAX_SPEED)
                },
                "16ce8f1b00e2b0e0fbc4dc8b46e629c8cd2ef0e1": {
                    "added_on": 1555812938,
                    "amount_left": 0,
                    "auto_tmm": false,
                    "category": "",
                    "completed": 966283000,
                    "completion_on": 1555813080,
                    "dl_limit": -1,
                    "dlspeed": GetRandomInt(MIN_SPEED, MAX_SPEED),
                    "downloaded": 966470211,
                    "downloaded_session": 0,
                    "eta": GetRandomInt(MIN_ETA_SIZE, MAX_ETA_SIZE),
                    "f_l_piece_prio": false,
                    "force_start": true,
                    "last_activity": 1583770394,
                    "magnet_uri": "another magnet",
                    "max_ratio": -1,
                    "max_seeding_time": -1,
                    "name": "Ubuntu Debian 18.04 LTS",
                    "num_complete": 14,
                    "num_incomplete": 1,
                    "num_leechs": 0,
                    "num_seeds": 0,
                    "priority": 0,
                    "progress": Math.random(),
                    "ratio": 1.1216271900179653,
                    "ratio_limit": -2,
                    "save_path": "C:/Downloads/Images/",
                    "seeding_time_limit": -2,
                    "seen_complete": 1566641377,
                    "seq_dl": false,
                    "size": GetRandomInt(MIN_FILE_SIZE, MAX_FILE_SIZE),
                    "state": torrent_states[GetRandomInt(0, states_length)],
                    "super_seeding": false,
                    "tags": "",
                    "time_active": 10218680,
                    "total_size": GetRandomInt(MIN_FILE_SIZE, MAX_FILE_SIZE),
                    "tracker": "https my tracker #3",
                    "up_limit": -1,
                    "uploaded": 1084019267,
                    "uploaded_session": 0,
                    "upspeed": GetRandomInt(MIN_SPEED, MAX_SPEED)
                }
            }
        };
    _addTorrentEntriesToMockData(25, result.torrents);
    return result;
}

/** Given some mock MainData, add num_entries copies of some data to list of torrents
 * @param num_entries The number of entries to add
 * @param data The raw data to append to
 */
function _addTorrentEntriesToMockData(num_entries, data) {
    let key = "0daea5cece5555";
    let name = "Ubuntu LTS ";
    let savePath = "A:/Images/";
    for(let i = 0; i < num_entries; i++) {
        data[key + i] =
        {
            "added_on": 1574566015,
            "amount_left": 0,
            "auto_tmm": false,
            "category": "",
            "completed": 209869298,
            "completion_on": 1574566120,
            "dl_limit": -1,
            "dlspeed": GetRandomInt(MIN_SPEED, MAX_SPEED),
            "downloaded": 210629655,
            "downloaded_session": 0,
            "eta": GetRandomInt(MIN_ETA_SIZE, MAX_ETA_SIZE),
            "f_l_piece_prio": false,
            "force_start": true,
            "last_activity": 1583690488,
            "magnet_uri": "magnet_uri",
            "max_ratio": -1,
            "max_seeding_time": -1,
            "name": name + i,
            "num_complete": 18,
            "num_incomplete": 1,
            "num_leechs": 0,
            "num_seeds": 0,
            "priority": 0,
            "progress": Math.random(),
            "ratio": 1.0442750048657679,
            "ratio_limit": -2,
            "save_path": savePath + name + i,
            "seeding_time_limit": -2,
            "seen_complete": 1580860752,
            "seq_dl": false,
            "size": GetRandomInt(MIN_FILE_SIZE, MAX_FILE_SIZE),
            "state": torrent_states[GetRandomInt(0, states_length)],
            "super_seeding": false,
            "tags": "",
            "time_active": 718637,
            "total_size": GetRandomInt(MIN_FILE_SIZE, MAX_FILE_SIZE),
            "tracker": "https some tracker",
            "up_limit": -1,
            "uploaded": 219955284,
            "uploaded_session": 0,
            "upspeed": GetRandomInt(MIN_SPEED, MAX_SPEED)
        }
    }
}

/** Mock object to represent this user's preference
 * NOTE: This object is imcomplete; for more info: https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-Documentation#get-qbittorrent-preferences
 */
function GetUserPreferences() {
    return (
        {"locale":"ru_RU",
        "save_path":"C:/Users/Dayman/Downloads",
        "temp_path_enabled":false,
        "temp_path":"C:/Users/Dayman/Documents/Downloads/temp",
        "scan_dirs":["D:/Browser Downloads"],
        "download_in_scan_dirs":[false],
        "export_dir_enabled":false,
        "export_dir":"",
        "autorun_enabled":false,
        "autorun_program":"",
        "preallocate_all":false,
        "queueing_enabled":true,
        "max_active_downloads":2,
        "max_active_torrents":200,
        "max_active_uploads":200,
        "listen_port":31498,
        "upnp":false,
        "dl_limit":3072,
        "up_limit":0,
        "max_connec":500,
        "max_connec_per_torrent":100,
        "max_uploads_per_torrent":15}
    );
}

function GetAppVersion() {
  return "v4.1.3";
}

function GetAPIVersion() {
  return "2.0";
}

module.exports.GetMainData = GetMainData;
module.exports.GetUserPreferences = GetUserPreferences;
module.exports.GetAppVersion = GetAppVersion;
module.exports.GetAPIVersion = GetAPIVersion;
