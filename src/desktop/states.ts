import { flatLayout, getAppLayout, kintoneClient } from '@/common/kintone-api';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { getAppId } from '@lb-ribbit/kintone-xapp';
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

export const appLayoutState = atom<kintoneAPI.Layout>({
  key: `${PREFIX}appLayoutState`,
  default: (async () => {
    const layout = await getAppLayout();
    return layout;
  })(),
});

export const appFieldsState = atom<kintoneAPI.FieldProperties>({
  key: `${PREFIX}appFieldsState`,
  default: (async () => {
    const { properties } = await kintoneClient.app.getFormFields({ app: getAppId()! });
    return properties;
  })(),
});

export const appGroupsState = selector<kintoneAPI.layout.Group[]>({
  key: `${PREFIX}appLabelState`,
  get: ({ get }) => {
    const layout = get(appLayoutState);

    const groups = Object.values(layout).reduce<kintoneAPI.layout.Group[]>(
      (acc, value) => (value.type === 'GROUP' ? [...acc, value] : acc),
      []
    );

    return groups;
  },
});

export const appSpacesState = selector<kintoneAPI.layout.Spacer[]>({
  key: `${PREFIX}appSpacesState`,
  get: ({ get }) => {
    const layout = get(appLayoutState);

    const fields = flatLayout(layout);

    const spacers = fields.filter((field) => field.type === 'SPACER') as kintoneAPI.layout.Spacer[];

    const filtered = spacers.filter((spacer) => spacer.elementId);

    return filtered;
  },
});
