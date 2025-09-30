import { InitOptions, Resource } from 'i18next'
import { i18n, i18nDefaultInitOptions } from './i18n'
import { useState } from 'react'
import Backend from 'i18next-http-backend'
import { ChildrenProps } from '@haus-storefront-react/shared-types'
import { useAsyncEffect } from '@haus-storefront-react/common-hooks/use-async-effect'
import { renderChildren } from '@haus-storefront-react/common-utils'
import { I18nextProvider } from 'react-i18next'

export type ResourceBundle = {
  lng: string
  ns: string
  resources: object
  deep?: boolean
  overwrite?: boolean
}

export interface LocalizationProviderProps {
  resourceBundles?: ResourceBundle[]
  translationsUrl?: string
  locale?: string
  i18nOptions?: InitOptions
  children?: ChildrenProps<{
    i18n: typeof i18n
  }>
}

export const LocalizationProvider = ({
  resourceBundles,
  translationsUrl,
  locale,
  i18nOptions,
  children,
}: LocalizationProviderProps) => {
  const [ready, setReady] = useState(false)

  useAsyncEffect(async () => {
    if (!i18n.isInitialized) {
      const i18nConfig: Omit<InitOptions, 'supportedLngs'> & {
        resources: Resource
        supportedLngs: readonly string[] | false
      } = {
        ...i18nDefaultInitOptions,
        ...i18nOptions,
      }

      if (resourceBundles) {
        resourceBundles?.forEach((resourceBundle) => {
          i18nConfig.resources = {
            ...i18nConfig.resources,
            [resourceBundle.lng]: {
              ...i18nConfig.resources[resourceBundle.lng],
              [resourceBundle.ns]: resourceBundle.resources,
            },
          }

          if (
            Array.isArray(i18nConfig?.supportedLngs) &&
            !i18nConfig.supportedLngs.includes(resourceBundle.lng)
          ) {
            i18nConfig.supportedLngs = [
              ...(Array.isArray(i18nConfig.supportedLngs) ? i18nConfig.supportedLngs : []),
              resourceBundle.lng,
            ]
          }
        })

        i18nConfig.supportedLngs = i18nConfig.supportedLngs || false
        i18nConfig.preload = resourceBundles.map((bundle) => bundle.lng)
      }

      await i18n.init(
        {
          ...i18nConfig,
        },
        (err, t) => {
          if (err) return console.log('something went wrong loading', err)
          t('key') // -> same as i18next.t
        },
      )
    }

    if (translationsUrl) {
      i18n.use(Backend).init({
        backend: {
          loadPath: translationsUrl,
        },
      })

      await i18n.reloadResources()
    }

    if (!resourceBundles && !translationsUrl) {
      await i18n.reloadResources()
    }

    if (!locale) {
      const lang = document.documentElement.lang
      const languageCode = lang.split('-')[0]

      if (i18n.language !== languageCode) {
        i18n.changeLanguage(languageCode)
      }
    } else {
      if (i18n.language !== locale) {
        i18n.changeLanguage(locale)
      }
    }

    setReady(true)
  }, [resourceBundles, translationsUrl, i18nOptions, locale])

  const loadResourceBundles = async () => {
    if (resourceBundles) {
      const a11yData = import.meta.glob('./*-a11y.json') as Record<
        string,
        () => Promise<{ default: object }>
      >

      const a11yPromises = Object.entries(a11yData).map(([path, importFunction]) => {
        const match = path.match(/\/(.+?)-a11y\.json$/)
        if (!match) {
          console.error(`Invalid file path: ${path}`)
          return Promise.resolve({
            lng: 'unknown',
            translation: {},
          })
        }
        const languageCode = match[1]
        return importFunction()
          .then((content) => ({
            lng: languageCode,
            translation: content.default,
          }))
          .catch((error) => {
            console.error(`Failed to load accessibility file for ${languageCode}:`, error)
            return {
              lng: languageCode,
              translation: {},
            }
          })
      })

      const a11yTranslations = await Promise.all(a11yPromises)
      const loadPromises = resourceBundles.map(async (resourceBundle) => {
        a11yTranslations.forEach(({ lng, translation }) => {
          if (lng === resourceBundle.lng) {
            const combinedResourceBundle = {
              ...resourceBundle,
              resources: {
                a11y: translation,
                ...resourceBundle.resources,
              },
            }
            i18n.addResourceBundle(
              combinedResourceBundle.lng,
              combinedResourceBundle.ns,
              combinedResourceBundle.resources,
              combinedResourceBundle.deep,
              combinedResourceBundle.overwrite,
            )
          }
        })
      })

      await Promise.all(loadPromises)
      await i18n.reloadResources()
      setReady(true)
    }
  }

  loadResourceBundles()

  return ready ? (
    <I18nextProvider i18n={i18n}>{renderChildren(children, { i18n })}</I18nextProvider>
  ) : null
}
