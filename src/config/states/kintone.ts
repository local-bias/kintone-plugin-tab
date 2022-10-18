import { selector } from 'recoil';
import { Properties } from '@kintone/rest-api-client/lib/client/types';
import { flatLayout, getAppLayout, getFieldProperties } from '@common/kintone-api';
import { kx } from '@type/kintone.api';

const PREFIX = `kintone`;

export const appFieldsState = selector<kx.FieldProperty[]>({
  key: 'AppFields',
  get: async () => {
    const properties = await getFieldProperties();

    const values = Object.values(properties);

    return values.sort((a, b) => a.label.localeCompare(b.label, 'ja'));
  },
});

export const appLayoutState = selector<kx.Layout>({
  key: `${PREFIX}appLayoutState`,
  get: async () => {
    const layout = await getAppLayout();
    return layout;
  },
});

export const appLabelsState = selector<string[]>({
  key: `${PREFIX}appLabelsState`,
  get: ({ get }) => {
    const layout = get(appLayoutState);

    const fields = flatLayout(layout);

    const labels = fields.filter((field) => field.type === 'LABEL') as kx.layout.Label[];

    const parser = new DOMParser();

    const texts = labels
      .map(({ label }) => {
        const doc = parser.parseFromString(label, 'text/html');
        return doc.body.textContent;
      })
      .filter((text) => !!text);

    return texts as string[];
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
