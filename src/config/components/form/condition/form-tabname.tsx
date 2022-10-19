import { TextField } from '@mui/material';
import React, { ChangeEventHandler, FC } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { tabNameState } from '../../../states/plugin';

type Props = { conditionIndex: number };

const Component: FC<Props> = ({ conditionIndex }) => {
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

export default Component;
