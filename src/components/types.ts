import { EnabledFilter } from "@haus-storefront-react/shared-types";

export type ProductListAttributes = {
  productListIdentifier?: string;
  facets?: string[];
  collectionId?: string;
  enablePagination: boolean;
  enableSort: boolean;
  priceFilterEnabled: boolean;
  filtersArray: EnabledFilter[];
  take: number;
};

export type FiltersAttributes = {
  productListIdentifier?: string;
  showFiltersAs: "dropdown" | "accordion";
  maxSkeletonLoaders?: number;
  mobileAsModal: boolean;
  mobileBreakpoint?: number;
  enabledFilters: EnabledFilter[];
};
