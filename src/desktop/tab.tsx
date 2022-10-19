import React, { FC, FCX } from 'react';
import styled from '@emotion/styled';
import { Tab, Tabs } from '@mui/material';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { appGroupsState, appSpacesState, pluginConfigState, tabIndexState } from './states';
import { getCurrentRecord, getSpaceElement, setFieldShown } from '@lb-ribbit/kintone-xapp';

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

        const { record } = getCurrentRecord();

        Object.keys(record).forEach((code) => {
          setFieldShown(code, true);
        });

        const condition = storage.conditions[index];

        for (const code of Object.keys(record)) {
          const exists = condition.fields.includes(code);
          setFieldShown(code, condition.displayMode === 'sub' ? !exists : exists);
        }

        const { groups = [], groupDisplayMode = 'sub' } = condition;
        const allGroups = await snapshot.getPromise(appGroupsState);
        for (const group of allGroups) {
          const exists = groups.includes(group.code);
          setFieldShown(group.code, groupDisplayMode === 'sub' ? !exists : exists);
        }

        const { spaceIds = [], spaceDisplayMode } = condition;
        const allSpaces = await snapshot.getPromise(appSpacesState);
        for (const space of allSpaces) {
          const exists = spaceIds.includes(space.elementId);
          const spaceElement = getSpaceElement(space.elementId);
          if (!spaceElement) {
            continue;
          }
          const spaceWrapper = spaceElement.parentElement;
          if (!spaceWrapper) {
            continue;
          }
          if ((spaceDisplayMode === 'sub' && exists) || (spaceDisplayMode === 'add' && !exists)) {
            spaceWrapper.style.display = 'none';
          } else {
            spaceWrapper.style.display = 'block';
          }
        }

        const { labels = [], labelDisplayMode = 'sub' } = condition;
        const labelElements = [
          ...Array.from(document.querySelectorAll<HTMLDivElement>('.control-label-field-gaia')),
          ...Array.from(document.querySelectorAll<HTMLDivElement>('.control-value-label-gaia')),
        ];

        for (const labelElement of labelElements) {
          const text = labelElement.textContent;
          console.log({ text, labels });
          const exists = text && labels.some((label) => label === text);
          if ((labelDisplayMode === 'sub' && exists) || (labelDisplayMode === 'add' && !exists)) {
            labelElement.style.display = 'none';
          } else {
            labelElement.style.display = 'block';
          }
        }
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
