import React, { useState, FC, FCX } from 'react';
import styled from '@emotion/styled';
import { Box, Tab, Tabs } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { pluginConfigState } from './states';
import { getCurrentRecord, setFieldShown } from '@common/kintone';

type ContainerProps = Readonly<{}>;
type Props = ContainerProps &
  Readonly<{
    index: number;
    onTabChange: (_: any, value: number) => void;
    storage: kintone.plugin.Storage | null;
  }>;

const Component: FCX<Props> = ({ className, index, onTabChange, storage }) => (
  <div {...{ className }}>
    <div>
      {!storage && <div></div>}
      {!!storage && (
        <Tabs orientation='vertical' variant='scrollable' value={index} onChange={onTabChange}>
          {storage.conditions.map((condition, i) => (
            <Tab key={i} label={condition.tabName} />
          ))}
        </Tabs>
      )}
    </div>
  </div>
);

const StyledComponent = styled(Component)`
  flex: 1;
  background-color: #fff;
  display: flex;
  height: 100%;
  border-right: 1px solid #e3e7e8;

  > div {
    position: sticky;
    top: 130px;
    min-width: 150px;
    height: calc(100vh - 130px);
  }
`;

const Container: FC<ContainerProps> = () => {
  const [index, setIndex] = useState(0);
  const storage = useRecoilValue(pluginConfigState);

  const onTabChange = (_: any, value: number) => {
    setIndex(value);
    if (!storage || !storage.conditions[value]) {
      return;
    }

    const { record } = getCurrentRecord();

    Object.keys(record).forEach((code) => {
      setFieldShown(code, true);
    });

    const condition = storage.conditions[value];

    if (condition.displayMode === 'sub') {
      condition.fields.map((code) => {
        setFieldShown(code, false);
      });
    } else {
      Object.keys(record).forEach((code) => {
        setFieldShown(code, condition.fields.includes(code));
      });
    }
  };

  return <StyledComponent {...{ index, onTabChange, storage }} />;
};

export default Container;
