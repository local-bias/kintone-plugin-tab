import { Tab, TabProps } from '@mui/material';
import React, { FC, Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import { conditionsState } from '../../../states/plugin';

type Props = TabProps & { index: number };

const Component: FC<Props> = ({ index, ...tabProps }) => {
  const conditions = useRecoilValue(conditionsState);

  const condition = conditions[index];

  if (condition && condition.tabName) {
    return <Tab label={`設定${index + 1}(${condition.tabName})`} {...tabProps} />;
  }
  return <Tab label={`設定${index + 1}`} {...tabProps} />;
};

const Container: FC<Props> = (props) => (
  <Suspense fallback={<Tab label={`設定${props.index + 1}`} {...props} />}>
    <Component {...props} />
  </Suspense>
);

export default Container;
