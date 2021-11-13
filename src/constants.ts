export class Constants {
  static TORRENT_TABLE_COLUMNS = [
    'Name', 'Size', 'Progress', 'Status',
    'Down Speed', 'Up Speed', 'ETA',
    'Ratio', 'Uploaded',
    'Completed On', 'Added On', 'Last Activity',
    'Category', 'Seeders', 'Leechers', 'Downloaded'
  ];
  
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
}
