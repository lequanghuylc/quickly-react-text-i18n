
export const EVENT_NAME = {
  UPDATE_LANG: (id : string) => 'UPDATE_LANG_' + id,
  UPDATE_ALL: 'UPDATE_ALL',
  UPDATE_TRANSLATION_KEY: (key : string, lang: string, id: string,) => `UPDATE_TRANSLATION_KEY_${key}_${lang}`,
  REMOTE_CONTROL_EVENT: (instanceIndex: number) => `REMOTE_CONTROL_EVENT_${instanceIndex}`,
};