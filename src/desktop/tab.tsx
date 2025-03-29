import styled from '@emotion/styled';
import { Tab, Tabs } from '@mui/material';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { FC, FCX } from 'react';
import { pluginConditionsAtom, tabIndexAtom } from './states';

const handleTabChangeAtom = atom(null, (_, set, __: unknown, index: number) => {
  set(tabIndexAtom, index);
});

const TabContainer: FC = () => {
  const conditions = useAtomValue(pluginConditionsAtom);
  const tabIndex = useAtomValue(tabIndexAtom);
  const onTabChange = useSetAtom(handleTabChangeAtom);

  return (
    <Tabs orientation='vertical' variant='scrollable' value={tabIndex} onChange={onTabChange}>
      {conditions.map((condition, i) => (
        <Tab key={i} label={condition.tabName} />
      ))}
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
