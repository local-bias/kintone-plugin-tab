declare namespace kintone {
  namespace plugin {
    /** プラグインがアプリ単位で保存する設定情報🔌 */
    type Storage = {
      conditions: Condition[];
    };

    type DisplayMode = 'add' | 'sub';

    /** プラグインの制御単位の設定情報🔌 */
    type Condition = {
      tabName: string;
      tabIcon: string;
      displayMode: DisplayMode;
      fields: string[];
      labelDisplayMode?: DisplayMode;
      labels?: string[];
      groupDisplayMode?: DisplayMode;
      groups?: string[];
    };
  }
}
