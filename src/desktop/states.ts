import { atom } from 'recoil';

export const pluginConfigState = atom<kintone.plugin.Storage | null>({
  key: 'pluginConfigState',
  default: null,
});

export const tabIndexState = atom<number>({
  key: 'tabIndexState',
  default: 0,
});
