import React, { FC, memo } from 'react';
import { useConditionIndex } from '../../../condition-index-provider';
import { hidesHRState } from '../../../../states/plugin';
import { RecoilSwitch } from '@konomi-app/kintone-utilities-react';

const Component: FC = () => {
  const conditionIndex = useConditionIndex();

  return (
    <div>
      <h3>罫線の設定</h3>
      <RecoilSwitch state={hidesHRState(conditionIndex)} label='罫線を全て非表示' />
    </div>
  );
};

export default memo(Component);
