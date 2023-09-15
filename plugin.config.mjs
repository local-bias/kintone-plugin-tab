//@ts-check
const hp = 'https://konomi.app/';
const commonCdn = 'https://cdn.jsdelivr.net/gh/local-bias/kintone-cdn@latest';
const localhost = 'https://127.0.0.1:6327';

/** @type { import('@konomi-app/kintone-utilities').PluginConfig } */
export default {
  manifest: {
    base: {
      manifest_version: 1,
      version: '2.6.0',
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
      icon: 'icon.png',
      homepage_url: { ja: hp, en: hp },
      desktop: { js: [`${commonCdn}/dist/desktop.js`], css: [] },
      mobile: { js: [`${commonCdn}/dist/desktop.js`], css: [] },
      config: {
        html: 'config.html',
        js: [`${commonCdn}/dist/config.js`],
        css: [],
        required_params: [],
      },
    },
    dev: {
      desktop: {
        js: [`${localhost}/dist/dev/desktop/index.js`],
        css: [`${localhost}/dist/dev/desktop.css`],
      },
      mobile: {
        js: [`${localhost}/dist/dev/desktop/index.js`],
        css: [`${localhost}/dist/dev/desktop.css`],
      },
      config: {
        js: [`${localhost}/dist/dev/config/index.js`],
        css: [`${localhost}/dist/dev/config.css`],
      },
    },
    prod: {
      desktop: { js: [`desktop.js`], css: [`desktop.css`] },
      mobile: { js: [`desktop.js`], css: [`desktop.css`] },
      config: { js: [`config.js`], css: [`config.css`] },
    },
  },
};
