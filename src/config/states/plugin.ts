import { produce } from 'immer';
import { atom, selector, selectorFamily } from 'recoil';

const PREFIX = 'plugin';

const updated = <T extends keyof kintone.plugin.Condition>(
  storage: kintone.plugin.Storage | null,
  props: {
    conditionIndex: number;
    key: T;
    value: kintone.plugin.Condition[T];
  }
) => {
  const { conditionIndex, key, value } = props;
  return produce(storage, (draft) => {
    if (!draft) {
      return;
    }
    draft.conditions[conditionIndex][key] = value;
  });
};

const getConditionField = <T extends keyof kintone.plugin.Condition>(
  storage: kintone.plugin.Storage | null,
  props: {
    conditionIndex: number;
    key: T;
    defaultValue: NonNullable<kintone.plugin.Condition[T]>;
  }
): NonNullable<kintone.plugin.Condition[T]> => {
  const { conditionIndex, key, defaultValue } = props;
  if (!storage || !storage.conditions[conditionIndex]) {
    return defaultValue;
  }
  return storage.conditions[conditionIndex][key] ?? defaultValue;
};

export const storageState = atom<kintone.plugin.Storage | null>({
  key: `${PREFIX}storageState`,
  default: null,
});

export const tabIndexState = atom<number>({
  key: `${PREFIX}tabIndexState`,
  default: 0,
});

export const conditionsState = selector<kintone.plugin.Condition[]>({
  key: `${PREFIX}conditionsState`,
  get: ({ get }) => {
    const storage = get(storageState);
    return storage?.conditions ?? [];
  },
});

export const conditionState = selectorFamily<kintone.plugin.Condition | null, number>({
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
          draft.conditions[index] = newValue as kintone.plugin.Condition;
        })
      );
    },
});

export const tabNameState = selectorFamily<string, number>({
  key: `${PREFIX}tabNameState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'tabName',
        defaultValue: '',
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, {
          conditionIndex,
          key: 'tabName',
          value: newValue as string,
        })
      );
    },
});

export const fieldDisplayModeState = selectorFamily<kintone.plugin.DisplayMode, number>({
  key: `${PREFIX}fieldDisplayModeState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'displayMode',
        defaultValue: 'sub',
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, {
          conditionIndex,
          key: 'displayMode',
          value: newValue as kintone.plugin.DisplayMode,
        })
      );
    },
});

export const fieldsState = selectorFamily<string[], number>({
  key: `${PREFIX}fieldsState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'fields',
        defaultValue: [''],
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, { conditionIndex, key: 'fields', value: newValue as string[] })
      );
    },
});

export const groupDisplayModeState = selectorFamily<kintone.plugin.DisplayMode, number>({
  key: `${PREFIX}groupDisplayModeState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'groupDisplayMode',
        defaultValue: 'sub',
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, {
          conditionIndex,
          key: 'groupDisplayMode',
          value: newValue as kintone.plugin.DisplayMode,
        })
      );
    },
});

export const groupsState = selectorFamily<string[], number>({
  key: `${PREFIX}groupsState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'groups',
        defaultValue: [''],
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, { conditionIndex, key: 'groups', value: newValue as string[] })
      );
    },
});

export const labelDisplayModeState = selectorFamily<kintone.plugin.DisplayMode, number>({
  key: `${PREFIX}labelDisplayModeState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'labelDisplayMode',
        defaultValue: 'sub',
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, {
          conditionIndex,
          key: 'labelDisplayMode',
          value: newValue as kintone.plugin.DisplayMode,
        })
      );
    },
});

export const labelsState = selectorFamily<string[], number>({
  key: `${PREFIX}labelsState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'labels',
        defaultValue: [''],
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, {
          conditionIndex,
          key: 'labels',
          value: newValue as string[],
        })
      );
    },
});

export const spaceDisplayModeState = selectorFamily<kintone.plugin.DisplayMode, number>({
  key: `${PREFIX}spaceDisplayModeState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'spaceDisplayMode',
        defaultValue: 'sub',
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, {
          conditionIndex,
          key: 'spaceDisplayMode',
          value: newValue as kintone.plugin.DisplayMode,
        })
      );
    },
});

export const spaceIdsState = selectorFamily<string[], number>({
  key: `${PREFIX}spaceIdsState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'spaceIds',
        defaultValue: [''],
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, {
          conditionIndex,
          key: 'spaceIds',
          value: newValue as string[],
        })
      );
    },
});

export const hidesHRState = selectorFamily<boolean, number>({
  key: `${PREFIX}hidesHRState`,
  get:
    (conditionIndex) =>
    ({ get }) => {
      return getConditionField(get(storageState), {
        conditionIndex,
        key: 'hidesHR',
        defaultValue: false,
      });
    },
  set:
    (conditionIndex) =>
    ({ set }, newValue) => {
      set(storageState, (current) =>
        updated(current, {
          conditionIndex,
          key: 'hidesHR',
          value: newValue as boolean,
        })
      );
    },
});
