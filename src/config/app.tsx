import React, { Suspense, FC } from 'react';
import { RecoilRoot } from 'recoil';
import { SnackbarProvider } from 'notistack';

import { restoreStorage } from '@/common/plugin';
import { PluginErrorBoundary } from '@/common/components/error-boundary';

import Layout from './components/model/layout';
import Sidebar from './components/model/sidebar';
import Form from './components/model/form';
import Footer from './components/model/footer';

import { pluginIdState } from './states';
import { storageState } from './states/plugin';
import { Loading } from '@/common/components/loading';
import { URL_PROMOTION } from '@/common/static';

const Component: FC<{ pluginId: string }> = ({ pluginId }) => (
  <>
    <RecoilRoot
      initializeState={({ set }) => {
        set(pluginIdState, pluginId);
        set(storageState, restoreStorage(pluginId));
      }}
    >
      <PluginErrorBoundary>
        <SnackbarProvider maxSnack={1}>
          <Layout>
            <Suspense fallback={<Loading label='設定情報を取得しています...' />}>
              <Sidebar />
              <Form />
              <Footer />
            </Suspense>
          </Layout>
        </SnackbarProvider>
      </PluginErrorBoundary>
    </RecoilRoot>
    <iframe
      title='promotion'
      loading='lazy'
      src={URL_PROMOTION}
      style={{ border: '0', width: '100%', height: '64px' }}
    />
  </>
);

export default Component;
