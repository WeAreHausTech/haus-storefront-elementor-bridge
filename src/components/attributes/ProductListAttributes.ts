import type { ProductListAttributes } from "../types";
import { parseDataAttributes } from "../utilities";
import { EnabledFilter } from "@haus-storefront-react/shared-types";

export function getProductListAttributes(
  attrs: NamedNodeMap
): ProductListAttributes {
  const base = parseDataAttributes(attrs) as Record<string, unknown>;

  const productListIdentifier = base.productListIdentifier as
    | string
    | undefined;

  const facetsRaw = base.facet as unknown;
  const facets = Array.isArray(facetsRaw)
    ? (facetsRaw as unknown[])
        .map(String)
        .map((s) => s.trim())
        .filter(Boolean)
    : typeof facetsRaw === "string" && facetsRaw
    ? facetsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;

  const collectionId = (base.collection as string | undefined) ?? undefined;

  const enablePagination = Boolean(base.paginationEnabled);
  const enableSort = Boolean(base.sortEnabled);
  const priceFilterEnabled = Boolean((base as any).priceFilterEnabled);
  const take = (base as any).take;

  const rawFilters = (base as any).filterValues as
    | Array<{
        filter_value: string;
        filter_condition: "AND" | "OR";
        filter_label?: string;
      }>
    | undefined;

  const filtersArray: EnabledFilter[] = Array.isArray(rawFilters)
    ? rawFilters.map((f) => ({
        facetCode: f.filter_value,
        logicalOperator: f.filter_condition.toLowerCase() as "and" | "or",
        label: f.filter_label,
      }))
    : [];

  if (priceFilterEnabled) filtersArray.push({ type: "price" });

  return {
    productListIdentifier,
    facets,
    collectionId,
    enablePagination,
    enableSort,
    priceFilterEnabled,
    filtersArray,
    take,
  };
}
