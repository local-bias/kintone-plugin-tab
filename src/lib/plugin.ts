import { restoreStorage } from '@konomi-app/kintone-utilities';
import { produce } from 'immer';
import { PLUGIN_ID } from './global';
import { nanoid } from 'nanoid';
import { z } from 'zod';

const DisplayModeSchema = z.union([z.literal('add'), z.literal('sub')]);
export type DisplayMode = z.infer<typeof DisplayModeSchema>;

const PluginConditionV1Schema = z.object({
  tabName: z.string(),
  tabIcon: z.string(),
  displayMode: DisplayModeSchema,
  fields: z.array(z.string()),
  labelDisplayMode: DisplayModeSchema.optional(),
  labels: z.array(z.string()),
  groupDisplayMode: DisplayModeSchema.optional(),
  groups: z.array(z.string()),
  spaceDisplayMode: DisplayModeSchema.optional(),
  spaceIds: z.array(z.string()),
  hidesHR: z.boolean(),
});
const PluginConfigV1Schema = z.object({
  version: z.literal(1),
  conditions: z.array(PluginConditionV1Schema),
});
type PluginConfigV1 = z.infer<typeof PluginConfigV1Schema>;

const PluginConditionV2Schema = PluginConditionV1Schema.merge(z.object({ id: z.string() }));
const PluginConfigV2Schema = z.object({
  version: z.literal(2),
  conditions: z.array(PluginConditionV2Schema),
});
type PluginConfigV2 = z.infer<typeof PluginConfigV2Schema>;

export type PluginConfig = PluginConfigV2;
export type PluginCondition = PluginConfig['conditions'][number];
type AnyPluginConfig = PluginConfigV1 | PluginConfigV2;

export const validateCondition = (condition: unknown): PluginCondition => {
  return PluginConditionV2Schema.parse(condition);
};

export const getNewCondition = (): PluginCondition => ({
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
export const createConfig = (): PluginConfig => ({
  version: 2,
  conditions: [getNewCondition()],
});

/**
 * 古いバージョンの設定情報を新しいバージョンに変換します
 * @param anyConfig 保存されている設定情報
 * @returns 新しいバージョンの設定情報
 */
export const migrateConfig = (anyConfig: AnyPluginConfig): PluginConfig => {
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
export const restorePluginConfig = (): PluginConfig => {
  const config = restoreStorage<AnyPluginConfig>(PLUGIN_ID) ?? createConfig();
  return migrateConfig(config);
};

export const getUpdatedStorage = <T extends keyof PluginCondition>(
  storage: PluginConfig,
  props: {
    conditionIndex: number;
    key: T;
    value: PluginCondition[T];
  }
) => {
  const { conditionIndex, key, value } = props;
  return produce(storage, (draft) => {
    draft.conditions[conditionIndex][key] = value;
  });
};

export const getConditionField = <T extends keyof PluginCondition>(
  storage: PluginConfig,
  props: {
    conditionIndex: number;
    key: T;
    defaultValue: NonNullable<PluginCondition[T]>;
  }
): NonNullable<PluginCondition[T]> => {
  const { conditionIndex, key, defaultValue } = props;
  if (!storage.conditions[conditionIndex]) {
    return defaultValue;
  }
  return storage.conditions[conditionIndex][key] ?? defaultValue;
};
