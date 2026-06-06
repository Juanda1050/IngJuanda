import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { enCommon } from '@/i18n/locales/en/common'
import { esCommon } from '@/i18n/locales/es/common'

void i18n.use(LanguageDetector).use(initReactI18next).init({
  resources: {
    en: { common: enCommon },
    es: { common: esCommon },
  },
  lng: typeof window !== 'undefined' ? (localStorage.getItem('i18nextLng') || 'en') : 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common'],
  interpolation: { escapeValue: false },
  detection: {
    order: ['localStorage'],
    caches: ['localStorage'],
  },
})

export default i18n
