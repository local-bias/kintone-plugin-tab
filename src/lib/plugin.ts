import { restoreStorage } from '@konomi-app/kintone-utilities';
import { produce } from 'immer';
import { PLUGIN_ID } from './global';
import { nanoid } from 'nanoid';

export const getNewCondition = (): Plugin.Condition => ({
  id: nanoid(),
  tabName: 'すべて',
  tabIcon: '',
  displayMode: 'sub',
  fields: [''],
  labelDisplayMode: 'sub',
  labels: [''],
  groupDisplayMode: 'sub',
  groups: [''],
  spaceDisplayMode: 'sub',
  spaceIds: [''],
  hidesHR: false,
});

/**
 * プラグインの設定情報のひな形を返却します
 */
export const createConfig = (): Plugin.Config => ({
  version: 2,
  conditions: [getNewCondition()],
});

/**
 * 古いバージョンの設定情報を新しいバージョンに変換します
 * @param anyConfig 保存されている設定情報
 * @returns 新しいバージョンの設定情報
 */
export const migrateConfig = (anyConfig: Plugin.AnyConfig): Plugin.Config => {
  const { version } = anyConfig;

  switch (version) {
    case undefined:
    case 1:
      return migrateConfig({
        version: 2,
        conditions: anyConfig.conditions.map((condition) => ({
          id: nanoid(),
          ...condition,
          fields: condition.fields.length === 0 ? [''] : condition.fields,
          labels: condition.labels.length === 0 ? [''] : condition.labels,
          groups: condition.groups.length === 0 ? [''] : condition.groups,
          spaceIds: condition.spaceIds.length === 0 ? [''] : condition.spaceIds,
        })),
      });
    case 2:
    default:
      return anyConfig;
  }
};

/**
 * プラグインの設定情報を復元します
 */
export const restorePluginConfig = (): Plugin.Config => {
  const config = restoreStorage<Plugin.AnyConfig>(PLUGIN_ID) ?? createConfig();
  return migrateConfig(config);
};

export const getUpdatedStorage = <T extends keyof Plugin.Condition>(
  storage: Plugin.Config,
  props: {
    conditionIndex: number;
    key: T;
    value: Plugin.Condition[T];
  }
) => {
  const { conditionIndex, key, value } = props;
  return produce(storage, (draft) => {
    draft.conditions[conditionIndex][key] = value;
  });
};

export const getConditionField = <T extends keyof Plugin.Condition>(
  storage: Plugin.Config,
  props: {
    conditionIndex: number;
    key: T;
    defaultValue: NonNullable<Plugin.Condition[T]>;
  }
): NonNullable<Plugin.Condition[T]> => {
  const { conditionIndex, key, defaultValue } = props;
  if (!storage.conditions[conditionIndex]) {
    return defaultValue;
  }
  return storage.conditions[conditionIndex][key] ?? defaultValue;
};
