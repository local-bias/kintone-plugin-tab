import { GUEST_SPACE_ID } from '@/lib/global';
import { restorePluginConfig } from '@/lib/plugin';
import { getAppId, getFormFields, getFormLayout, kintoneAPI } from '@konomi-app/kintone-utilities';
import { atom } from 'jotai';
// import { focusAtom } from 'jotai-optics';

export const kintoneEventAtom = atom<kintoneAPI.js.EventType | null>(null);

export const kintoneAppAtom = atom(getAppId());

export const pluginConfigAtom = atom(restorePluginConfig());
// export const pluginConditionsAtom = focusAtom(pluginConfigAtom, (s) => s.prop('conditions'));
export const pluginConditionsAtom = atom(
  (get) => get(pluginConfigAtom).conditions,
  (_, set, newValue: Plugin.Condition[]) => {
    set(pluginConfigAtom, (prev) => ({ ...prev, conditions: newValue }));
  }
);

export const tabIndexAtom = atom(0);

export const selectedConditionAtom = atom((get) => {
  const pluginConfig = get(pluginConfigAtom);
  const tabIndex = get(tabIndexAtom);
  return pluginConfig.conditions[tabIndex];
});

export const appFieldsAtom = atom<Promise<kintoneAPI.FieldProperties | null>>(async (get) => {
  const app = get(kintoneAppAtom);
  if (!app) {
    return null;
  }
  const { properties } = await getFormFields({
    app,
    guestSpaceId: GUEST_SPACE_ID,
    debug: process.env.NODE_ENV === 'development',
  });
  return properties;
});

export const appLayoutAtom = atom<Promise<kintoneAPI.Layout | null>>(async (get) => {
  const app = get(kintoneAppAtom);
  if (!app) {
    return null;
  }
  const { layout } = await getFormLayout({
    app,
    guestSpaceId: GUEST_SPACE_ID,
    debug: process.env.NODE_ENV === 'development',
  });
  return layout;
});
