import { appEn } from './app'
import { toolbarEn } from './toolbar'
import { safariEn } from './safari'
import { finderEn } from './finder'
import { calendarEn } from './calendar'
import { notesEn } from './notes'
import { messagesEn } from './messages'
import { mailEn } from './mail'
import { settingsEn } from './settings'
import { sectionsEn } from './sections'
import { tutorialEn } from './tutorial'
import { dashboardEn } from './dashboard'

export const enCommon = {
  app: appEn,
  toolbar: toolbarEn,
  safari: safariEn,
  finder: finderEn,
  calendar: calendarEn,
  notes: notesEn,
  messages: messagesEn,
  mail: mailEn,
  settings: settingsEn,
  files: appEn.files,
  actions: appEn.actions,
  sections: sectionsEn,
  tutorial: tutorialEn,
  dashboard: dashboardEn,
} as const;

