import { restorePluginConfig } from '@/lib/plugin';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { atom } from 'recoil';

const PREFIX = `DesktopState`;

export const pluginConfigState = atom<Plugin.Config>({
  key: 'pluginConfigState',
  default: restorePluginConfig(),
});

export const tabIndexState = atom<number>({
  key: 'tabIndexState',
  default: 0,
});

export const appLayoutState = atom<kintoneAPI.Layout | null>({
  key: `${PREFIX}appLayoutState`,
  default: null,
});

export const appFieldsState = atom<kintoneAPI.FieldProperties | null>({
  key: `${PREFIX}appFieldsState`,
  default: null,
});
