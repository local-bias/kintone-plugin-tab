import { Suspense, FC } from 'react';
import { RecoilRoot } from 'recoil';
import { SnackbarProvider } from 'notistack';
import {
  PluginBanner,
  PluginContent,
  PluginLayout,
  PluginConfigProvider,
  Notification,
} from '@konomi-app/kintone-utilities-react';
import { PluginErrorBoundary } from '@/lib/components/error-boundary';
import Sidebar from './components/model/sidebar';
import Form from './components/model/form';
import Footer from './components/model/footer';
import config from '../../plugin.config.mjs';
import { URL_BANNER, URL_PROMOTION } from '@/lib/static';
import { LoaderWithLabel } from '@konomi-app/ui-react';

const Component: FC = () => (
  <>
    <RecoilRoot>
      <PluginErrorBoundary>
        <PluginConfigProvider config={config}>
          <Notification />
          <SnackbarProvider maxSnack={1}>
            <Suspense fallback={<LoaderWithLabel label='設定情報を取得しています' />}>
              <PluginLayout>
                <Sidebar />
                <PluginContent>
                  <Form />
                </PluginContent>
                <PluginBanner url={URL_BANNER} />
                <Footer />
              </PluginLayout>
            </Suspense>
          </SnackbarProvider>
        </PluginConfigProvider>
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
