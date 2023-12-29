import React, { Suspense, FC } from 'react';
import { RecoilRoot } from 'recoil';
import { SnackbarProvider } from 'notistack';

import { PluginErrorBoundary } from '@/lib/components/error-boundary';

import Layout from './components/model/layout';
import Sidebar from './components/model/sidebar';
import Form from './components/model/form';
import Footer from './components/model/footer';

import { URL_PROMOTION } from '@/lib/static';
import { LoaderWithLabel } from '@konomi-app/ui-react';

const Component: FC = () => (
  <>
    <RecoilRoot>
      <PluginErrorBoundary>
        <SnackbarProvider maxSnack={1}>
          <Layout>
            <Suspense fallback={<LoaderWithLabel label='設定情報を取得しています...' />}>
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
