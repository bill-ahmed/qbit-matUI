import { Constants } from 'src/constants';
import { WebUISettings } from 'src/utils/Interfaces';

const all_columns = Constants.TORRENT_TABLE_COLUMNS

/** A class to represent various default configurations for the application. */
export class ApplicationDefaults {

  /** All default Web UI options */
  static DEFAULT_WEB_UI_SETTINGS: WebUISettings = {
    dark_mode_enabled: false,
    file_system: { use_alt_delimiter: false, delimiter: '/' },
    network: { refresh_interval: 1500, auto_refresh: true },
    notifications: { show_snack_notifications: true },
    torrent_table: {
      default_sort_order: {
        column_name: 'Completed On',
        order: 'desc'
      },
      columns_to_show: ['select', 'Actions', 'Name', 'Size', 'Progress', 'Status', 'Down Speed', 'Up Speed', 'ETA', 'Completed On'],
      column_widths: all_columns.reduce((prev, col) => { prev[col] = 0; return prev; }, {}) as any
    },
    upload_torrents: {
      show_parsed_torrents_from_file: true,
      show_parsed_torrents_from_magnet: true
    }
  }
}
