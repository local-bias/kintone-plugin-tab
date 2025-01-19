import { detectGuestSpaceId } from '@konomi-app/kintone-utilities';

export const ENV = (process?.env?.NODE_ENV ?? 'production') as 'production' | 'development';
export const isProd = ENV === 'production';

export const PLUGIN_ID = kintone.$PLUGIN_ID;
export const GUEST_SPACE_ID = detectGuestSpaceId() ?? undefined;
export const LANGUAGE = kintone.getLoginUser()?.language;

process.env.NODE_ENV === 'development' &&
  console.log('[plugin] Global variables have been redefined');
