import styled from '@emotion/styled';
import { Tab, Tabs } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import React, { FC, FCX, useCallback } from 'react';
import { refresh } from './actions';
import { pluginConditionsAtom, tabIndexAtom } from './states';

const TabContent: FC = () => {
  const conditions = useAtomValue(pluginConditionsAtom);
  return conditions.map((condition, i) => <Tab key={i} label={condition.tabName} />);
};

const TabContainer: FC = () => {
  const tabIndex = useAtomValue(tabIndexAtom);

  const onTabChange = useAtomCallback(
    useCallback(async (get, set, _: any, index: number) => {
      set(tabIndexAtom, index);
      refresh();
    }, [])
  );

  return (
    <Tabs orientation='vertical' variant='scrollable' value={tabIndex} onChange={onTabChange}>
      <TabContent />
    </Tabs>
  );
};

const Container: FCX = ({ className }) => (
  <div {...{ className }}>
    <div>
      <TabContainer />
    </div>
  </div>
);

const StyledContainer = styled(Container)`
  flex: 1;
  background-color: #fff;
  display: flex;
  height: 100%;
  border-right: 1px solid #e3e7e8;

  > div {
    position: sticky;
    top: 130px;
    min-width: 150px;
    max-width: 200px;
    height: calc(100vh - 130px);
  }
`;

export default StyledContainer;
