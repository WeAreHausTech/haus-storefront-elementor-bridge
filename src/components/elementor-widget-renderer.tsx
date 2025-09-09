import React, { JSX } from "react";
import ReactDOM from "react-dom/client";
import type { DataProviderProps } from "@haus-storefront-react/core";
import { DataProvider } from "@haus-storefront-react/core";

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

interface ElementorWidgetRendererProps {
    dataProviderProps: Omit<DataProviderProps, "children">;
}

export class ElementorWidgetRenderer {
    dataProviderProps: ElementorWidgetRendererProps["dataProviderProps"];

    constructor(
        dataProviderProps: ElementorWidgetRendererProps["dataProviderProps"]
    ) {
        this.dataProviderProps = dataProviderProps;
    }

    propsFromDataAttributes(dataAttributes: NamedNodeMap) {
        const props: Record<string, string> = {};

        Array.from(dataAttributes).forEach((attr) => {
            if (
                attr.name.startsWith("data-") &&
                attr.name !== "data-widget-type"
            ) {
                const key = attr.name
                    .slice(5)
                    .replace(/-([a-z])/g, (_, c) => c.toUpperCase());
                props[key] = attr.value;
            }
        });

        if (props.product) {
            props.productId = props.product;
            delete props.product;
        }
        if (props.variant) {
            props.variantId = props.variant;
            delete props.variant;
        }

        return props;
    }

    render(widget: JSX.Element, widgetType: string) {
        let elements = document.querySelectorAll(
            `[data-widget-type="${widgetType}"]`
        );
        if (elements.length === 0 && !widgetType.includes("-widget")) {
            elements = document.querySelectorAll(
                `[data-widget-type="${widgetType}-widget"]`
            );
        }
        if (!elements) {
            throw new Error(`No elementor widget found: ${widgetType}`);
        }
        elements.forEach((element) => {
            const shadowRoot = element.attachShadow({ mode: "open" });
            if (!shadowRoot) {
                throw new Error("No shadow root found");
            }

            // Create style element and apply existing styles
            const styleEl = document.createElement("style");
            styleEl.setAttribute("id", "ecom-components-styles");

            // Extract additional `.ec-` styles from loaded stylesheets
            const ecStyleEl = document.createElement("style");
            ecStyleEl.setAttribute("id", "ecom-components-ec-styles");

            // Append styles to shadow root
            shadowRoot?.appendChild(styleEl);
            shadowRoot?.appendChild(ecStyleEl);

            // Fix for activeElement not being correct in shadow DOM when tabbing
            const originalActiveElement = Object.getOwnPropertyDescriptor(
                Document.prototype,
                "activeElement"
            )?.get;

            if (originalActiveElement) {
                Object.defineProperty(Document.prototype, "activeElement", {
                    get() {
                        const activeElement = originalActiveElement.call(this);
                        return (
                            activeElement?.shadowRoot?.activeElement ??
                            activeElement
                        );
                    },
                });
            }

            const props = this.propsFromDataAttributes(element.attributes);
            const widgetWithProps = React.cloneElement(widget, props);

            return ReactDOM.createRoot(shadowRoot).render(
                <React.StrictMode>
                    <DataProvider
                        {...(this.dataProviderProps as DataProviderProps)}
                    >
                        {widgetWithProps}
                    </DataProvider>
                </React.StrictMode>
            );
        });
    }
}
