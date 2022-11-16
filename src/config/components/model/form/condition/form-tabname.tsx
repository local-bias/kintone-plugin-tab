import { TextField } from '@mui/material';
import React, { ChangeEventHandler, FC, memo } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { tabNameState } from '../../../../states/plugin';
import { useConditionIndex } from '../../../condition-index-provider';

const Component: FC = () => {
  const conditionIndex = useConditionIndex();
  const tabName = useRecoilValue(tabNameState(conditionIndex));

  const onTabNameChange: ChangeEventHandler<HTMLInputElement> = useRecoilCallback(
    ({ set }) =>
      (event) => {
        set(tabNameState(conditionIndex), event.target.value);
      },
    [conditionIndex]
  );

  return (
    <TextField
      className='input'
      label='タブ名'
      variant='outlined'
      value={tabName}
      onChange={onTabNameChange}
    />
  );
};

export default memo(Component);
