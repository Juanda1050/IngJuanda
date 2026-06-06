import { appEs } from './app'
import { toolbarEs } from './toolbar'
import { safariEs } from './safari'
import { finderEs } from './finder'
import { calendarEs } from './calendar'
import { notesEs } from './notes'
import { messagesEs } from './messages'
import { musicEs } from './music'
import { mailEs } from './mail'
import { settingsEs } from './settings'
import { sectionsEs } from './sections'

export const esCommon = {
  app: appEs,
  toolbar: toolbarEs,
  safari: safariEs,
  finder: finderEs,
  calendar: calendarEs,
  notes: notesEs,
  messages: messagesEs,
  music: musicEs,
  mail: mailEs,
  settings: settingsEs,
  files: appEs.files,
  actions: appEs.actions,
  sections: sectionsEs,
} as const;
