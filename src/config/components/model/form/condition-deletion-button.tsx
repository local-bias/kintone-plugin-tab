import {
  pluginConditionsAtom,
  selectedConditionIdAtom,
  tabIndexAtom,
} from '@/config/states/plugin';
import { PluginConditionDeleteButton } from '@konomi-app/kintone-utilities-react';
import { useAtomValue } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { FC, memo, useCallback } from 'react';

const Container: FC = () => {
  const index = useAtomValue(tabIndexAtom);

  const onClick = useAtomCallback(
    useCallback(
      async (get, set) => {
        const selectedConditionId = get(selectedConditionIdAtom);
        if (selectedConditionId === null) {
          return;
        }
        set(pluginConditionsAtom, (current) =>
          current.filter((condition) => condition.id !== selectedConditionId)
        );
        set(tabIndexAtom, (i) => (i === 0 ? i : i - 1));
      },
      [index]
    )
  );

  return <PluginConditionDeleteButton {...{ onClick }} />;
};

export default memo(Container);
