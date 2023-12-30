import React from 'react';
import { createRoot } from 'react-dom/client';
import { css } from '@emotion/css';
import { restorePluginConfig } from '@/lib/plugin';

import App from './app';
import { getFormFields, getFormLayout } from '@konomi-app/kintone-utilities';
import { GUEST_SPACE_ID } from '@/lib/global';
import { getAppId } from '@lb-ribbit/kintone-xapp';
import { refresh } from './actions';
import { manager } from '@/lib/listener';

const ROOT_ID = 'ribbit-tab-plugin-root';

manager.add(
  ['app.record.create.show', 'app.record.edit.show', 'app.record.detail.show'],
  async (event) => {
    const config = restorePluginConfig();
    if (!config?.conditions?.length) {
      return event;
    }
    const app = getAppId()!;
    const { properties } = await getFormFields({
      app,
      guestSpaceId: GUEST_SPACE_ID,
      debug: process.env.NODE_ENV === 'development',
    });
    const { layout } = await getFormLayout({
      app,
      guestSpaceId: GUEST_SPACE_ID,
      debug: process.env.NODE_ENV === 'development',
    });
    refresh({ condition: config.conditions[0], fieldProperties: properties, layout });
    let rootElement: HTMLElement | null = null;
    if (!document.getElementById(ROOT_ID)) {
      const target = document.querySelector('#record-gaia');

      if (!target) {
        console.log('タブをレンダリングする対象エレメントが取得できませんでした');
        return event;
      }

      target.classList.add(css`
        padding: 0 !important;
        display: flex;
        gap: 8px;
      `);

      rootElement = document.createElement('div');
      rootElement.id = ROOT_ID;

      target.prepend(rootElement);
    } else {
      rootElement = document.getElementById(ROOT_ID);
    }

    const root = createRoot(rootElement!);
    root.render(<App initTabIndex={0} properties={properties} layout={layout} />);

    return event;
  }
);
