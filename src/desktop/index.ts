import '@/common/global';
import event from './event';
import { KintoneEventListener } from '@konomi-app/kintone-utilities';
import { PLUGIN_NAME } from '@/common/static';

const listener = new KintoneEventListener({
  errorHandler: (error, props) => {
    const { event } = props;
    event.error = `プラグイン「${PLUGIN_NAME}」の処理内でエラーが発生しました。`;
    console.error('エラー', error);
  },
  logDisabled: process.env.NODE_ENV === 'production',
});

event(listener);
