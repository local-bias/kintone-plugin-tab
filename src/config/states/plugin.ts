import { PluginCondition, PluginConfig, restorePluginConfig } from '@/lib/plugin';
import { produce } from 'immer';
import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';
import { SetStateAction } from 'react';

export const loadingAtom = atom<boolean>(false);

export const pluginConfigAtom = atom<PluginConfig>(restorePluginConfig());

export const selectedConditionIdAtom = atomWithReset<string | null>(null);

export const tabIndexAtom = atom<number>(0);

// export const pluginConditionsAtom = focusAtom(pluginConfigAtom, (s) => s.prop('conditions'));
export const pluginConditionsAtom = atom(
  (get) => get(pluginConfigAtom).conditions,
  (_, set, newValue: SetStateAction<PluginCondition[]>) => {
    set(pluginConfigAtom, (current) =>
      produce(current, (draft) => {
        draft.conditions = typeof newValue === 'function' ? newValue(draft.conditions) : newValue;
      })
    );
  }
);

export const selectedConditionAtom = atom(
  (get) => {
    const conditions = get(pluginConditionsAtom);
    const selectedConditionId = get(selectedConditionIdAtom);
    return conditions.find((condition) => condition.id === selectedConditionId) ?? conditions[0]!;
  },
  (get, set, newValue: SetStateAction<PluginCondition>) => {
    const selectedConditionId = get(selectedConditionIdAtom);
    const conditions = get(pluginConditionsAtom);
    const index = conditions.findIndex((condition) => condition.id === selectedConditionId);
    if (index === -1) {
      return;
    }
    set(pluginConfigAtom, (current) =>
      produce(current, (draft) => {
        draft.conditions[index] =
          typeof newValue === 'function' ? newValue(draft.conditions[index]) : newValue;
      })
    );
  }
);

// export const getConditionPropertyAtom = <T extends keyof PluginCondition>(property: T) =>
//   focusAtom(selectedConditionAtom, (s) => s.prop(property)) as PrimitiveAtom<PluginCondition[T]>;
export const getConditionPropertyAtom = <T extends keyof PluginCondition>(property: T) =>
  atom(
    (get) => {
      return get(selectedConditionAtom)[property];
    },
    (_, set, newValue: SetStateAction<PluginCondition[T]>) => {
      set(selectedConditionAtom, (condition) =>
        produce(condition, (draft) => {
          draft[property] = typeof newValue === 'function' ? newValue(draft[property]) : newValue;
        })
      );
    }
  );

export const tabNameAtom = getConditionPropertyAtom('tabName');
export const fieldDisplayModeState = getConditionPropertyAtom('displayMode');
export const fieldsState = getConditionPropertyAtom('fields');
export const groupDisplayModeState = getConditionPropertyAtom('groupDisplayMode');
export const groupsState = getConditionPropertyAtom('groups');
export const labelDisplayModeState = getConditionPropertyAtom('labelDisplayMode');
export const labelsState = getConditionPropertyAtom('labels');
export const spaceDisplayModeState = getConditionPropertyAtom('spaceDisplayMode');
export const spaceIdsState = getConditionPropertyAtom('spaceIds');
export const hidesHRState = getConditionPropertyAtom('hidesHR');
