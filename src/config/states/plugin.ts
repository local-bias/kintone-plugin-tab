import { getUpdatedStorage, restorePluginConfig } from '@/lib/plugin';
import { produce } from 'immer';
import { RecoilState, atom, selector, selectorFamily } from 'recoil';

const PREFIX = 'plugin';

export const loadingState = atom<boolean>({
  key: `${PREFIX}loadingState`,
  default: false,
});

export const storageState = atom<Plugin.Config>({
  key: `${PREFIX}storageState`,
  default: restorePluginConfig(),
});

export const tabIndexState = atom<number>({
  key: `${PREFIX}tabIndexState`,
  default: 0,
});

export const conditionsState = selector<Plugin.Condition[]>({
  key: `${PREFIX}conditionsState`,
  get: ({ get }) => {
    const storage = get(storageState);
    return storage?.conditions ?? [];
  },
});

export const conditionState = selectorFamily<Plugin.Condition | null, number>({
  key: `${PREFIX}conditionState`,
  get:
    (index) =>
    ({ get }) => {
      const storage = get(storageState);

      if (!storage || !storage.conditions[index]) {
        return null;
      }
      return storage.conditions[index];
    },
  set:
    (index) =>
    ({ set }, newValue) => {
      if (!newValue) {
        return;
      }
      set(storageState, (current) =>
        produce(current, (draft) => {
          if (!draft) {
            return;
          }
          draft.conditions[index] = newValue as Plugin.Condition;
        })
      );
    },
});

const conditionPropertyState = selectorFamily<
  Plugin.Condition[keyof Plugin.Condition],
  keyof Plugin.Condition
>({
  key: `${PREFIX}conditionPropertyState`,
  get:
    (key) =>
    ({ get }) => {
      const conditionIndex = get(tabIndexState);
      const storage = get(storageState);
      return storage.conditions[conditionIndex][key];
    },
  set:
    (key) =>
    ({ get, set }, newValue) => {
      const conditionIndex = get(tabIndexState);
      set(storageState, (current) =>
        getUpdatedStorage(current, {
          conditionIndex,
          key,
          value: newValue as Plugin.Condition[keyof Plugin.Condition],
        })
      );
    },
});

export const getConditionPropertyState = <T extends keyof Plugin.Condition>(property: T) =>
  conditionPropertyState(property) as unknown as RecoilState<Plugin.Condition[T]>;

export const tabNameState = getConditionPropertyState('tabName');
export const fieldDisplayModeState = getConditionPropertyState('displayMode');
export const fieldsState = getConditionPropertyState('fields');
export const groupDisplayModeState = getConditionPropertyState('groupDisplayMode');
export const groupsState = getConditionPropertyState('groups');
export const labelDisplayModeState = getConditionPropertyState('labelDisplayMode');
export const labelsState = getConditionPropertyState('labels');
export const spaceDisplayModeState = getConditionPropertyState('spaceDisplayMode');
export const spaceIdsState = getConditionPropertyState('spaceIds');
export const hidesHRState = getConditionPropertyState('hidesHR');
