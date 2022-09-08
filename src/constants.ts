export class Constants {
  static TORRENT_TABLE_COLUMNS = [
    'Name', 'Size', 'Progress', 'Status',
    'Down Speed', 'Up Speed', 'ETA',
    'Ratio', 'Uploaded',
    'Completed On', 'Added On', 'Last Activity',
    'Category', 'Seeders', 'Leechers', 'Downloaded', 'Tracker'
  ];
  
  /**
   * Map column name to its property in the Torrent object.
   */
  static TORRENT_TABLE_COLUMNS_MAPPING = {
    'Name': 'name',
    'Size': 'size',
    'Progress': 'progress',
    'Status': 'state',
    'Down Speed': 'dlspeed',
    'Up Speed': 'upspeed',
    'ETA': 'eta',
    'Ratio': 'ratio',
    
    'Downloaded': 'downloaded',
    'Uploaded': 'uploaded',
  
    'Completed On': 'completion_on',
    'Added On': 'added_on',
    'Last Activity': 'last_activity',
    'Category': 'category',
  
    'Seeders': 'num_seeds',
    'Leechers': 'num_leechs',
    'Tracker': 'tracker'
  }

  /**
   * Map column name to width in pixels;
   */
  static TORRENT_TABLE_COLUMNS_WIDTHS = {
    'Actions': 120,
    'Name': 450,
    
    'Size': 85,
    'Progress': 175,
    'Status': 140,

    'Up Speed': 100,
    'Down Speed': 120,

    'ETA': 115,
    'Ratio': 75,

    'Downloaded': 100,
    'Uploaded': 100,

    'Added On': 170,
    'Completed On': 170,
    'Last Activity': 170,
    
    'Category': 120,

    'Seeders': 85,
    'Leechers': 85,
    'Tracker': 120
  }
  
  /** 
   * Map a filter state as defined in global-transfer-info-component
   * to a list of states that encompass it.
   * 
   * For example, the state "Error" may apply to any of: `['error', 'stalledDL', 'unknown', etc...]`
   */
  static TORRENT_STATE_MAPPING = {
    'Downloading': ['downloading', 'pausedUP'],
    'Seeding': ['uploading', 'stalledUP', 'forcedUP'],
    'Completed': ['uploading', 'stalledUP', 'forcedUP'],
    'Resumed': ['uploading', 'stalledUP', 'forcedUP'],
    'Paused': ['pausedUP', 'pausedDL'],
    'Active': ['uploading', 'downloading', 'metaDL', 'forcedUP', 'forcedDL', 'forcedMetaDL'],
    'Inactive': ['pausedUP', 'pausedDL', 'queuedUP', 'queuedDL', 'stalledUP'],
    'Stalled': ['stalledUP', 'stalledDL'],
    'Errored': ['error', 'missingFiles', 'unknown', 'stalledDL'],
  }
}
