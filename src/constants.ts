export class Constants {
  static TORRENT_TABLE_COLUMNS = [
    'Name', 'Size', 'Progress', 'Status',
    'Down Speed', 'Up Speed', 'ETA',
    'Ratio', 'Uploaded',
    'Completed On', 'Added On', 'Last Activity',
    'Category', 'Seeders', 'Leechers', 'Downloaded'
  ];
  
  /**
   * Map column name its property in the Torrent object
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
    'Leechers': 85
  }
}
