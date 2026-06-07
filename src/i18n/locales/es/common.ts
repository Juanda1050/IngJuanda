import { appEs } from './app'
import { toolbarEs } from './toolbar'
import { safariEs } from './safari'
import { finderEs } from './finder'
import { calendarEs } from './calendar'
import { notesEs } from './notes'
import { messagesEs } from './messages'
import { mailEs } from './mail'
import { settingsEs } from './settings'
import { sectionsEs } from './sections'
import { tutorialEs } from './tutorial'

export const esCommon = {
  app: appEs,
  toolbar: toolbarEs,
  safari: safariEs,
  finder: finderEs,
  calendar: calendarEs,
  notes: notesEs,
  messages: messagesEs,
  mail: mailEs,
  settings: settingsEs,
  files: appEs.files,
  actions: appEs.actions,
  sections: sectionsEs,
  tutorial: tutorialEs,
} as const;
