import React, { FC, memo } from 'react';
import { tabNameState } from '../../../../states/plugin';
import { useConditionIndex } from '../../../condition-index-provider';
import { RecoilText } from '@konomi-app/kintone-utilities-react';

const Component: FC = () => {
  const conditionIndex = useConditionIndex();

  return (
    <RecoilText
      state={tabNameState(conditionIndex)}
      className='input'
      label='タブ名'
      variant='outlined'
    />
  );
};

export default memo(Component);
