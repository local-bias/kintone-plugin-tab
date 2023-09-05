import React, { FC } from 'react';
import { RecoilRoot } from 'recoil';

import { PluginErrorBoundary } from '@/common/components/error-boundary';

import Tab from './tab';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { appFieldsState, appLayoutState } from './states';

type Props = Readonly<{ properties: kintoneAPI.FieldProperties; layout: kintoneAPI.Layout }>;

const Component: FC<Props> = ({ properties, layout }) => (
  <RecoilRoot
    initializeState={({ set }) => {
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
