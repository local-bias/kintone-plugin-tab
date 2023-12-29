import React from 'react';
import { createRoot } from 'react-dom/client';
import { css } from '@emotion/css';
import { restoreStorage } from '@/common/plugin';

import App from './app';
import { getFormFields, getFormLayout } from '@konomi-app/kintone-utilities';
import { GUEST_SPACE_ID, PLUGIN_ID } from '@/common/global';
import { getAppId } from '@lb-ribbit/kintone-xapp';
import { refresh } from './actions';
import { manager } from '@/common/listener';

const ROOT_ID = 'ribbit-tab-plugin-root';

manager.add(
  ['app.record.create.show', 'app.record.edit.show', 'app.record.detail.show'],
  async (event) => {
    const config = restoreStorage(PLUGIN_ID);
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
    if (document.getElementById(ROOT_ID)) {
      return event;
    }

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

    const div = document.createElement('div');
    div.id = ROOT_ID;

    target.prepend(div);

    createRoot(div).render(<App properties={properties} layout={layout} />);

    return event;
  }
);
