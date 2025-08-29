import {
  VendureDataProviderProps,
  ComponentProviderProps,
  DataProvider,
  // vendureQueryClient,
} from "@haus-storefront-react/core";
import React, { ReactNode } from "react";
import ReactDOM from "react-dom/client";
import { BuilderQueryUpdates } from "@haus-storefront-react/shared-types";
import { camelCase, debounce, set } from "lodash";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export interface IWidgetsRendererOptions {
  provider: "vendure";
  updates: BuilderQueryUpdates;
  options: VendureDataProviderProps["options"];
  sdkInstance?: VendureDataProviderProps["sdkInstance"];
}

export interface ResourceBundle {
  lng: string;
  ns: string;
  resources: Record<string, unknown>;
}

export type ConditionalTemplateProps = {
  conditions: {
    [key: string]: {
      inputType:
        | "productVariant"
        | "product"
        | "activeOrder"
        | "activeCustomer"; // Add more input types as needed (e.g. 'product', 'cart', etc.)
      fn: (input: never) => boolean;
    };
  };
};

export type CustomWidgetProps = {
  widgetType: "conditional-template";
  props: ConditionalTemplateProps;
};

export class WidgetsRenderer {
  provider: "vendure";
  updates: BuilderQueryUpdates;
  options: VendureDataProviderProps["options"];
  sdkInstance: VendureDataProviderProps["sdkInstance"];
  widgets: Record<
    string,
    (
      dataAttributes: NamedNodeMap,
      widgetProps: ConditionalTemplateProps
    ) => ReactNode
  > = {};
  translations: ResourceBundle[] = [];
  customComponents: ComponentProviderProps["components"];
  customWidgetProps: CustomWidgetProps[];
  enableReactQueryDevtools = false;

  constructor(
    { provider, updates, options, sdkInstance }: IWidgetsRendererOptions,
    widgets?: Record<
      string,
      (
        dataAttributes: NamedNodeMap,
        widgetProps: ConditionalTemplateProps
      ) => ReactNode
    >,
    translations?: ResourceBundle[],
    customComponents?: ComponentProviderProps["components"],
    customWidgetProps?: CustomWidgetProps[]
  ) {
    set(options, "localizationProviderProps.resourceBundles", translations);
    set(options, "customComponents", customComponents);

    this.provider = provider;
    this.updates = updates;
    this.options = options;
    this.sdkInstance = sdkInstance;
    this.widgets = widgets || {};
    this.translations = translations || [];
    this.customComponents = customComponents || [];
    this.customWidgetProps = customWidgetProps || [];
  }

  private async renderElement(element: Element, children: ReactNode) {
    console.log("hello from widget renderer");
    // const css = await this.fetchCSSContent()
    const shadowRoot = element.attachShadow({ mode: "open" });

    // Create style element and apply existing styles
    const styleEl = document.createElement("style");
    styleEl.setAttribute("id", "ecom-components-styles");

    // Extract additional `.ec-` styles from loaded stylesheets
    const ecStyleEl = document.createElement("style");
    ecStyleEl.setAttribute("id", "ecom-components-ec-styles");
    // const extraEcStyles = extractEcStylesFromStyleSheets();
    // ecStyleEl.textContent = `\n${extraEcStyles}`;

    // Inject styles into Shadow DOM
    shadowRoot.appendChild(styleEl);
    shadowRoot.appendChild(ecStyleEl);

    // Fix for activeElement not being correct in shadow DOM when tabbing
    const originalActiveElement = Object.getOwnPropertyDescriptor(
      Document.prototype,
      "activeElement"
    )?.get;

    if (originalActiveElement) {
      Object.defineProperty(Document.prototype, "activeElement", {
        get() {
          const activeElement = originalActiveElement.call(this);
          return activeElement?.shadowRoot?.activeElement ?? activeElement;
        },
      });
    }

    return ReactDOM.createRoot(shadowRoot).render(
      <React.StrictMode>
        <DataProvider
          provider={this.provider}
          updates={this.updates}
          options={this.options}
          sdkInstance={this.sdkInstance}
        >
          {children}
        </DataProvider>
      </React.StrictMode>
    );
  }

  private renderElements(parentElement: ParentNode = document) {
    const elements: Element[] = Array.from(
      (parentElement as Element).getElementsByClassName("ecom-components-root")
    );

    elements.forEach((element: Element) => {
      if (element.shadowRoot) {
        return;
      }

      const dataAttributes = element.attributes;
      const widgetType = dataAttributes.getNamedItem("data-widget-type")?.value;
      console.log("widgetType", widgetType);

      if (widgetType) {
        const widgetProps = this.customWidgetProps.find(
          (widget) => widget.widgetType === widgetType
        )?.props as Extract<
          CustomWidgetProps,
          { widgetType: typeof widgetType }
        >["props"];

        const widget =
          this.widgets[camelCase(widgetType) as keyof typeof this.widgets];

        if (widget) {
          const widgetElement = widget(dataAttributes, widgetProps);

          this.renderElement(element, widgetElement);
        } else {
          console.error(`Widget ${widgetType} not found`);
        }
      }
    });
  }

  init(callback?: () => void) {
    console.log("init 124");
    if (document.readyState !== "loading") {
      this.renderElements();
      this.setupObserver();
      // this.setupReactQueryDevtools();
      callback?.();
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        this.renderElements();
        this.setupObserver();
        // this.setupReactQueryDevtools();
        callback?.();
      });
    }
  }

  setupObserver() {
    const debouncedRenderElements = debounce(() => this.renderElements(), 300, {
      leading: false,
      trailing: true,
    });

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              const found =
                node.getElementsByClassName("ecom-components-root").length > 0;
              if (found) {
                debouncedRenderElements();
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  //   setupReactQueryDevtools() {
  //     if (!this.enableReactQueryDevtools) {
  //       return;
  //     }
  //     const devtools = document.createElement("div");
  //     devtools.id = "devtools";
  //     document.body.appendChild(devtools);

  //     const shadowRoot = devtools.attachShadow({ mode: "open" });

  //     const ReactQueryDevtoolsProduction = React.lazy(() =>
  //       import("@tanstack/react-query-devtools/build/modern/production.js").then(
  //         (d) => ({
  //           default: d.ReactQueryDevtools,
  //         })
  //       )
  //     );

  //     return ReactDOM.createRoot(shadowRoot).render(
  //       <React.StrictMode>
  //         <QueryClientProvider
  //           client={vendureQueryClient as unknown as QueryClient}
  //         >
  //           <ReactQueryDevtoolsProduction
  //             client={vendureQueryClient as unknown as QueryClient}
  //             shadowDOMTarget={shadowRoot}
  //           />
  //         </QueryClientProvider>
  //       </React.StrictMode>
  //     );
  //   }
}

/**
 * Extracts all `.ec-` styles from loaded stylesheets.
 */
// const extractEcStylesFromStyleSheets = (): string => {
//   const ecStyles: string[] = [];

//   for (const sheet of document.styleSheets) {
//     try {
//       for (const rule of sheet.cssRules) {
//         if (
//           rule instanceof CSSStyleRule &&
//           rule.selectorText.startsWith(".ec-")
//         ) {
//           ecStyles.push(rule.cssText);
//         }
//       }
//     } catch (error: unknown) {
//       // Catch CORS-restricted stylesheets
//       console.warn("Could not access stylesheet:", sheet.href, error);
//     }
//   }

//   return ecStyles.join("\n");
// };
