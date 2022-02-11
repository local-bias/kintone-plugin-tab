import { atom } from 'recoil';

export const pluginConfigState = atom<kintone.plugin.Storage | null>({
  key: 'pluginConfigState',
  default: null,
});
