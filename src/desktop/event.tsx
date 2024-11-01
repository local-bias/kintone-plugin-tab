import { manager } from '@/lib/listener';
import { restorePluginConfig } from '@/lib/plugin';
import { css } from '@emotion/css';
import { isMobile } from '@konomi-app/kintone-utilities';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { refresh } from './actions';
import App from './app';

const ROOT_ID = 'ribbit-tab-plugin-root';

let cachedRoot: Root | null = null;

manager.add(
  ['app.record.create.show', 'app.record.edit.show', 'app.record.detail.show'],
  async (event) => {
    if (isMobile(event.type)) {
      return event;
    }
    const config = restorePluginConfig();
    if (!config?.conditions?.length) {
      return event;
    }

    refresh();
    if (!cachedRoot) {
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

      const rootElement = document.createElement('div');
      rootElement.id = ROOT_ID;
      const root = createRoot(rootElement);
      cachedRoot = root;

      target.prepend(rootElement);
    }

    cachedRoot.render(<App />);

    return event;
  }
);
