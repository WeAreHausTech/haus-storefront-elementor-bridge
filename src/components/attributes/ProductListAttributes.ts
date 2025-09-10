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
  const facetValueIds = Array.isArray(facetsRaw)
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
  const take = (base as any).take;

  return {
    productListIdentifier,
    facetValueIds,
    collectionId,
    enablePagination,
    take,
  };
}
