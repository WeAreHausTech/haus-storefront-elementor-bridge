import type { AccountDropdownAttributes, AccountMenuItem } from "../types";
import { parseDataAttributes } from "../utilities";

export function getAccountDropdownAttributes(
  attrs: NamedNodeMap
): AccountDropdownAttributes {
  const base = parseDataAttributes(attrs) as Record<string, unknown>;

  let itemsRaw = (base as any).menuItems as unknown;
  let menuItems: AccountMenuItem[] = [];

  if (typeof itemsRaw === "string") {
    try {
      menuItems = JSON.parse(itemsRaw);
    } catch {
      menuItems = [];
    }
  } else if (Array.isArray(itemsRaw)) {
    menuItems = itemsRaw as AccountMenuItem[];
  }

  return {
    menuItems,
  };
}
