import React, { FC, FCX } from 'react';
import styled from '@emotion/styled';
import { Tab, Tabs } from '@mui/material';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { appFieldsState, appLayoutState, pluginConfigState, tabIndexState } from './states';
import { refresh } from './actions';

const TabComponent: FC = () => {
  const storage = useRecoilValue(pluginConfigState)!;
  const tabIndex = useRecoilValue(tabIndexState);

  const onTabChange = useRecoilCallback(
    ({ set, snapshot }) =>
      async (_: any, index: number) => {
        set(tabIndexState, index);
        const storage = await snapshot.getPromise(pluginConfigState);

        if (!storage || !storage.conditions[index]) {
          return;
        }

        const condition = storage.conditions[index];
        const fieldProperties = (await snapshot.getPromise(appFieldsState))!;
        const layout = (await snapshot.getPromise(appLayoutState))!;

        refresh({ condition, fieldProperties, layout });
      },
    []
  );

  if (!storage) {
    return <div></div>;
  }

  return (
    <Tabs orientation='vertical' variant='scrollable' value={tabIndex} onChange={onTabChange}>
      {storage.conditions.map((condition, i) => (
        <Tab key={i} label={condition.tabName} />
      ))}
    </Tabs>
  );
};

const Container: FCX = ({ className }) => (
  <div {...{ className }}>
    <div>
      <TabComponent />
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
