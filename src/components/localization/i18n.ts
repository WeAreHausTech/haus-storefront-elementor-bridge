import i18next, { i18n as i18nType } from 'i18next'
import { initReactI18next } from 'react-i18next'

declare global {
  var __STORE_I18N_INSTANCE__: i18nType
}

const i18n: i18nType = (globalThis.__STORE_I18N_INSTANCE__ ||= i18next.createInstance())

const i18nDefaultInitOptions = {
  resources: {},
  fallbackLng: 'en',
  supportedLngs: ['en'],
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
  react: {
    // Avoid Suspense on the server; prevents SSR aborts while waiting for translations
    useSuspense: false,
  },
  debug: false,
  preload: ['en'],
  // backend: {
  //   loadPath: '/locales/{{lng}}/{{ns}}.json',
  // },
}

i18n.use(initReactI18next)

export { i18n, i18nDefaultInitOptions }
