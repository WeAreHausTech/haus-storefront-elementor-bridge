import { EnabledFilter } from "@haus-storefront-react/shared-types";

export type ProductListAttributes = {
  productListIdentifier?: string;
  facetValueIds?: string[];
  collectionId?: string;
  enablePagination: boolean;
  take: number;
};

export type FiltersAttributes = {
  productListIdentifier?: string;
  maxSkeletonLoaders?: number;
  enabledFilters: EnabledFilter[];
};
