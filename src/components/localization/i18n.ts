import i18next, { i18n as i18nType } from 'i18next'
import { initReactI18next } from 'react-i18next'

declare global {
  var __STORE_I18N_INSTANCE__: i18nType
}

const i18nDefaultInitOptions = {
  resources: {},
  fallbackLng: 'en',
  supportedLngs: ['en'],
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
  react: {
    useSuspense: true,
  },
  debug: true,
  preload: ['en'],
  // backend: {
  //   loadPath: '/locales/{{lng}}/{{ns}}.json',
  // },
}

const i18n: i18nType = (globalThis.__STORE_I18N_INSTANCE__ ||=
  i18next.createInstance(i18nDefaultInitOptions))

i18n.use(initReactI18next)

export { i18n, i18nDefaultInitOptions }
