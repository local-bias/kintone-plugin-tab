import React, { FC, memo } from 'react';
import { useConditionIndex } from '../../../condition-index-provider';
import { hidesHRState } from '../../../../states/plugin';
import {
  PluginFormSection,
  PluginFormTitle,
  RecoilSwitch,
} from '@konomi-app/kintone-utilities-react';

const Component: FC = () => {
  const conditionIndex = useConditionIndex();

  return (
    <PluginFormSection>
      <PluginFormTitle>罫線の設定</PluginFormTitle>
      <RecoilSwitch state={hidesHRState(conditionIndex)} label='罫線を全て非表示' />
    </PluginFormSection>
  );
};

export default memo(Component);
