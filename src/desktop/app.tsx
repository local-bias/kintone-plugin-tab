import React, { FC } from 'react';
import { RecoilRoot } from 'recoil';

import { PluginErrorBoundary } from '@/lib/components/error-boundary';

import Tab from './tab';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { appFieldsState, appLayoutState, tabIndexState } from './states';

type Props = Readonly<{
  initTabIndex: number;
  properties: kintoneAPI.FieldProperties;
  layout: kintoneAPI.Layout;
}>;

const Component: FC<Props> = ({ initTabIndex, properties, layout }) => (
  <RecoilRoot
    initializeState={({ set }) => {
      set(tabIndexState, initTabIndex);
      set(appFieldsState, properties);
      set(appLayoutState, layout);
    }}
  >
    <PluginErrorBoundary>
      <Tab />
    </PluginErrorBoundary>
  </RecoilRoot>
);

export default Component;
