import React, { FC, memo } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { FormControlLabel, Switch } from '@mui/material';
import { useConditionIndex } from '../../../condition-index-provider';
import { hidesHRState } from '../../../../states/plugin';

const Component: FC = () => {
  const conditionIndex = useConditionIndex();
  const hidesHR = useRecoilValue(hidesHRState(conditionIndex));

  const onSwitchChange = useRecoilCallback(
    ({ set }) =>
      (checked: boolean) => {
        set(hidesHRState(conditionIndex), checked);
      },
    [conditionIndex]
  );

  return (
    <div>
      <h3>罫線の設定</h3>
      <FormControlLabel
        control={<Switch color='primary' checked={hidesHR} />}
        onChange={(_, checked) => onSwitchChange(checked)}
        label='罫線を全て非表示'
      />
    </div>
  );
};

export default memo(Component);
