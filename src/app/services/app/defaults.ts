import { WebUISettings } from 'src/utils/Interfaces';

/** A class to represent various default configurations for the application. */
export class ApplicationDefaults {

  /** All default Web UI options */
  static DEFAULT_WEB_UI_SETTINGS: WebUISettings = {
    dark_mode_enabled: false,
    file_system: { use_alt_delimiter: false, delimiter: '/' },
    network: { refresh_interval: 1500, auto_refresh: true },
    notifications: { show_snack_notifications: false },
    torrent_table: {
      paginate: false,
      default_items_per_page: 10,
      showFirstAndLastOptions: false,
      default_sort_order: {
        column_name: 'Completed On',
        order: 'desc'
      },
      columns_to_show: ['select', 'Actions', 'Name', 'Size', 'Progress', 'Status', 'Down Speed', 'Up Speed', 'ETA', 'Completed On']
    },
    upload_torrents: {
      show_parsed_torrents_from_file: true,
      show_parsed_torrents_from_magnet: true
    }
  }
}
