import React, { FC } from 'react';
import { RecoilRoot } from 'recoil';

import { PluginErrorBoundary } from '@common/components/error-boundary';

import { pluginConfigState } from './states';
import Tab from './tab';

type Props = Readonly<{ config: kintone.plugin.Storage }>;

const Component: FC<Props> = ({ config }) => (
  <RecoilRoot
    initializeState={({ set }) => {
      set(pluginConfigState, config);
    }}
  >
    <PluginErrorBoundary>
      <Tab />
    </PluginErrorBoundary>
  </RecoilRoot>
);

export default Component;
