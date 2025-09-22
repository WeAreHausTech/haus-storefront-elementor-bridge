import { useEventBusOn, productChannel } from "@haus-storefront-react/core";
import { useCallback, useLayoutEffect, useMemo } from "react";
import {
  Customer,
  Maybe,
  Order,
  ProductVariant,
} from "@haus-storefront-react/shared-types";
import {
  useActiveCustomer,
  useActiveOrder,
  useProduct,
} from "@haus-storefront-react/hooks";

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

export type CustomTemplateProps = {
  templateId?: string;
  templateIdFalse?: string;
  condition: "priceIsZero";
  customConditions: ConditionalTemplateProps["conditions"] | undefined;
  productId?: string;
};

const defaultConditions: ConditionalTemplateProps["conditions"] = {
  priceIsZero: {
    inputType: "productVariant",
    fn: (input: Maybe<ProductVariant>) =>
      input?.price !== undefined && Number(input.price) === 0,
  },
  cartIsEmpty: {
    inputType: "activeOrder",
    fn: (input: Maybe<Order>) => !input?.lines?.length,
  },
  userIsLoggedIn: {
    inputType: "activeCustomer",
    fn: (input: Maybe<Customer>) => input !== null,
  },
};

export const ConditionalTemplate = ({
  templateId,
  templateIdFalse,
  condition,
  customConditions,
  productId,
}: CustomTemplateProps) => {
  // Convert numeric IDs to strings to prevent .endsWith() errors
  const stringTemplateId = templateId != null ? String(templateId) : undefined;
  const stringTemplateIdFalse =
    templateIdFalse != null ? String(templateIdFalse) : undefined;
  const stringProductId = productId != null ? String(productId) : undefined;
  const [selectedProductVariant] = useEventBusOn(
    productChannel,
    "product:variant:selected"
  );

  const inputType = useMemo(() => {
    const allConditions = {
      ...defaultConditions,
      ...(customConditions || {}),
    };
    return allConditions[condition]?.inputType;
  }, [condition, customConditions]);

  const { data: product, isLoading: productLoading } = useProduct(
    { id: stringProductId ?? "" },
    inputType === "product" && !!stringProductId
  );

  const { data: activeCustomer, isLoading: customerLoading } =
    useActiveCustomer({
      enabled: inputType === "activeCustomer",
    });

  const { data: activeOrder, isLoading: orderLoading } = useActiveOrder({
    enabled: inputType === "activeOrder",
  });

  const handleConditions = useCallback(
    (conditions: ConditionalTemplateProps["conditions"]) => {
      const inputTypes = {
        productVariant: selectedProductVariant,
        product,
        activeOrder,
        activeCustomer,
      };

      const element = document.getElementById(
        `ecom-elementor-template-${stringTemplateId}`
      );
      const elementFalse = document.getElementById(
        `ecom-elementor-template-${stringTemplateIdFalse}`
      );
      const conditionDef = conditions[condition];

      if (!element && !elementFalse) return;
      if (!conditionDef) return;

      const isLoading =
        (inputType === "product" && productLoading) ||
        (inputType === "activeCustomer" && customerLoading) ||
        (inputType === "activeOrder" && orderLoading);

      if (isLoading) {
        if (element) {
          element.style.display = "none";
        }
        if (elementFalse) {
          elementFalse.style.display = "none";
        }
        return;
      }

      const conditionValue = conditionDef.fn(
        inputTypes[conditionDef.inputType] as never
      );

      if (conditionValue) {
        if (element) {
          element.style.display = "block";
        }
        if (elementFalse) {
          elementFalse.style.display = "none";
        }
      } else {
        if (element) {
          element.style.display = "none";
        }
        if (elementFalse) {
          elementFalse.style.display = "block";
        }
      }
    },
    [
      selectedProductVariant,
      product,
      activeOrder,
      stringTemplateId,
      stringTemplateIdFalse,
      condition,
      activeCustomer,
      productLoading,
      customerLoading,
      orderLoading,
      inputType,
    ]
  );

  useLayoutEffect(() => {
    const allConditions = {
      ...defaultConditions,
      ...(customConditions || {}),
    };

    handleConditions(allConditions);
  }, [customConditions, handleConditions]);

  return null;
};

export default ConditionalTemplate;
