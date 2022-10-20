import React, { FC, memo } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { FormControlLabel, Switch } from '@mui/material';
import { hidesHRState } from '../../../states/plugin';

type Props = { conditionIndex: number };

const Component: FC<Props> = ({ conditionIndex }) => {
  const hidesHR = useRecoilValue(hidesHRState(conditionIndex));

  const onSwitchChange = useRecoilCallback(
    ({ set }) =>
      (checked: boolean) => {
        set(hidesHRState(conditionIndex), checked);
      },
    [conditionIndex]
  );

  return (
    <FormControlLabel
      control={<Switch color='primary' checked={hidesHR} />}
      onChange={(_, checked) => onSwitchChange(checked)}
      label='罫線を全て非表示'
    />
  );
};

export default memo(Component);
