import type { FiltersAttributes } from "../types";
import { parseDataAttributes } from "../utilities";
import { EnabledFilter } from "@haus-storefront-react/shared-types";

export function getFiltersAttributes(attrs: NamedNodeMap): FiltersAttributes {
  const base = parseDataAttributes(attrs) as Record<string, unknown>;

  console.log("base", base);

  const productListIdentifier = base.productListIdentifier as
    | string
    | undefined;

  const priceFilterEnabled = Boolean((base as any).priceFilterEnabled);

  const maxSkeletonLoaders =
    typeof (base as any).maxSkeletonLoaders === "number"
      ? ((base as any).maxSkeletonLoaders as number)
      : undefined;

  let rawFilters = (base as any).filterValues as
    | Array<{
        filter_value: string;
        filter_condition: "AND" | "OR" | "NOT";
        filter_label?: string;
      }>
    | string
    | undefined;

  if (typeof rawFilters === "string") {
    let parsed: unknown = undefined;
    try {
      parsed = JSON.parse(rawFilters);
    } catch {
      try {
        const textArea = document.createElement("textarea");
        textArea.innerHTML = rawFilters;
        const decoded = textArea.value.replace(/&quot;/g, '"');
        parsed = JSON.parse(decoded);
      } catch {
        parsed = undefined;
      }
    }
    rawFilters = Array.isArray(parsed)
      ? (parsed as unknown as Array<{
          filter_value: string;
          filter_condition: "AND" | "OR" | "NOT";
          filter_label?: string;
        }>)
      : undefined;
  }

  const enabledFilters: EnabledFilter[] = Array.isArray(rawFilters)
    ? rawFilters.map((f) => ({
        facetCode: f.filter_value,
        logicalOperator: f.filter_condition.toLowerCase() as "and" | "or",
        label: f.filter_label || undefined,
        type: "facet",
      }))
    : [];

  if (priceFilterEnabled) {
    enabledFilters.push({ type: "price" });
  }

  return {
    productListIdentifier,
    maxSkeletonLoaders,
    enabledFilters,
  };
}
