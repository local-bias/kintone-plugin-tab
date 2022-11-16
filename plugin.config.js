const REPO = 'https://cdn.jsdelivr.net/gh/local-bias/kintone-plugin-tab@latest';

/** @type {import('./src/types/plugin-config').PluginConfig} */
module.exports = {
  manifest: {
    base: {
      manifest_version: 1,
      version: 240,
      type: 'APP',
      name: {
        en: 'vertical tab plugin',
        ja: 'タブ表示プラグイン',
        zh: '垂直标签插件',
      },
      description: {
        en: 'add vertical tab',
        ja: 'スクロールに追従する垂直方向のタブを追加します',
        zh: '添加垂直标签',
      },
      icon: 'image/icon.png',
      homepage_url: {
        ja: 'https://konomi.app',
        en: 'https://konomi.app',
      },
      desktop: {
        js: ['https://cdn.jsdelivr.net/gh/local-bias/kintone-cdn@latest/dist/desktop.js'],
        css: [],
      },
      mobile: {
        js: ['https://cdn.jsdelivr.net/gh/local-bias/kintone-cdn@latest/dist/desktop.js'],
        css: [],
      },
      config: {
        html: 'html/config.html',
        js: ['https://cdn.jsdelivr.net/gh/local-bias/kintone-cdn@latest/dist/config.js'],
        css: [],
        required_params: [],
      },
    },
    dev: {
      desktop: { js: ['js/desktop.js'] },
      mobile: { js: ['js/desktop.js'] },
      config: { js: ['js/config.js'] },
    },
    prod: {
      desktop: { js: [`${REPO}/cdn/desktop.js`] },
      mobile: { js: [`${REPO}/cdn/desktop.js`] },
      config: { js: [`${REPO}/cdn/config.js`] },
    },
  },
};
