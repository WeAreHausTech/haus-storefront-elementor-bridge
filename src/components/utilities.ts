export type Parsers = Record<string, (raw: string) => unknown>;

const toCamel = (k: string) =>
  k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

export function parseDataAttributes(attrs: NamedNodeMap, parsers?: Parsers) {
  const props: Record<string, unknown> = {};
  for (const { name, value } of Array.from(attrs)) {
    if (!name.startsWith("data-")) continue;
    const key = toCamel(name.slice(5));

    if (parsers?.[key]) {
      props[key] = parsers[key](value);
      continue;
    }

    // sensible defaults
    const isBooleanKey =
      /^(is|has)[A-Z]/.test(key) ||
      /(Enabled|Disabled|Visible|Active|Required|Selected|Checked|Allow)$/i.test(
        key
      );

    if (value === "true" || value === "false") {
      props[key] = value === "true";
    } else if (isBooleanKey && /^(0|1|yes|no|on|off)$/i.test(value.trim())) {
      const v = value.trim().toLowerCase();
      props[key] = v === "1" || v === "yes" || v === "on";
    } else if (/^-?\d+(\.\d+)?$/.test(value)) {
      props[key] = Number(value);
    } else if (value.trim().startsWith("{") || value.trim().startsWith("[")) {
      try {
        props[key] = JSON.parse(value);
      } catch {
        props[key] = value;
      }
    } else if (value.includes(",")) {
      props[key] = value.split(",").map((s) => s.trim());
    } else props[key] = value;
  }
  return props;
}
