import { flatLayout, getAppLayout } from '@common/kintone-api';
import { kx } from '@type/kintone.api';
import { atom, selector } from 'recoil';

const PREFIX = `DesktopState`;

export const pluginConfigState = atom<kintone.plugin.Storage | null>({
  key: 'pluginConfigState',
  default: null,
});

export const tabIndexState = atom<number>({
  key: 'tabIndexState',
  default: 0,
});

export const appLayoutState = selector<kx.Layout>({
  key: `${PREFIX}appLayoutState`,
  get: async () => {
    const layout = await getAppLayout();
    return layout;
  },
});

export const appGroupsState = selector<kx.layout.Group[]>({
  key: `${PREFIX}appLabelState`,
  get: ({ get }) => {
    const layout = get(appLayoutState);

    const groups = Object.values(layout).reduce<kx.layout.Group[]>(
      (acc, value) => (value.type === 'GROUP' ? [...acc, value] : acc),
      []
    );

    return groups;
  },
});
