import { PluginErrorBoundary } from '@/lib/components/error-boundary';
import { store } from '@/lib/store';
import { Provider } from 'jotai';
import React, { FC } from 'react';
import Tab from './tab';

const App: FC = () => (
  <Provider store={store}>
    <PluginErrorBoundary>
      <Tab />
    </PluginErrorBoundary>
  </Provider>
);

export default App;
