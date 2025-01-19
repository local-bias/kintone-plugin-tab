import { GUEST_SPACE_ID } from '@/lib/global';
import { flatLayout } from '@/lib/kintone-api';
import { getAppId, getFormFields, getFormLayout, kintoneAPI } from '@konomi-app/kintone-utilities';
import { atom } from 'jotai';

export const appFieldsAtom = atom<Promise<kintoneAPI.FieldProperty[]>>(async () => {
  const app = getAppId();
  if (!app) {
    throw new Error('アプリのフィールド情報が取得できませんでした');
  }

  const { properties } = await getFormFields({
    app,
    preview: true,
    guestSpaceId: GUEST_SPACE_ID,
    debug: process.env.NODE_ENV === 'development',
  });

  const values = Object.values(properties);

  return values.sort((a, b) => a.label.localeCompare(b.label, 'ja'));
});

export const appLayoutAtom = atom<Promise<kintoneAPI.Layout>>(async () => {
  const app = getAppId();
  if (!app) {
    throw new Error('アプリのフィールド情報が取得できませんでした');
  }

  const { layout } = await getFormLayout({
    app,
    preview: true,
    guestSpaceId: GUEST_SPACE_ID,
    debug: process.env.NODE_ENV === 'development',
  });
  return layout;
});

export const appLabelsAtom = atom<Promise<string[]>>(async (get) => {
  const layout = await get(appLayoutAtom);

  const fields = flatLayout(layout);

  const labels = fields.filter((field) => field.type === 'LABEL') as kintoneAPI.layout.Label[];

  const parser = new DOMParser();

  const texts = labels
    .map(({ label }) => {
      const doc = parser.parseFromString(label, 'text/html');
      return doc.body.textContent;
    })
    .filter((text) => !!text);

  return texts as string[];
});

export const appGroupsAtom = atom<Promise<kintoneAPI.layout.Group[]>>(async (get) => {
  const layout = await get(appLayoutAtom);

  const groups = Object.values(layout).reduce<kintoneAPI.layout.Group[]>(
    (acc, value) => (value.type === 'GROUP' ? [...acc, value] : acc),
    []
  );

  return groups;
});

export const appSpacesState = atom<Promise<kintoneAPI.layout.Spacer[]>>(async (get) => {
  const layout = await get(appLayoutAtom);

  const fields = flatLayout(layout);

  const spaces = fields.filter((field) => field.type === 'SPACER') as kintoneAPI.layout.Spacer[];

  const filtered = spaces.filter((space) => space.elementId);

  return filtered;
});
