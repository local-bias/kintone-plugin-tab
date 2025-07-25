import { manager } from '@/lib/listener';
import { restorePluginConfig } from '@/lib/plugin';
import { css } from '@emotion/css';
import { isMobile } from '@konomi-app/kintone-utilities';
import { ComponentManager } from '@konomi-app/kintone-utilities-react';
import { refresh } from './actions';
import App from './app';

const ROOT_ID = '🐸ribbit-tab-plugin-root';

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

    ComponentManager.getInstance().renderComponent({
      id: ROOT_ID,
      component: <App />,
      parentElement: target,
      prepend: true,
    });

    return event;
  }
);
