const intFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const floatFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});
const floatFormatter2 = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatInt(x: number) {
  return intFormatter.format(x);
}

export function formatFloat(x: number, precision?: number) {
  if (precision === 2) {
    return floatFormatter2.format(x);
  } else {
    return floatFormatter.format(x);
  }
}

export function sentenceCasing(x: string): string {
  return x.charAt(0).toUpperCase() + x.slice(1).toLowerCase();
}

const listFormatLong = new Intl.ListFormat(undefined, {
  style: "long",
  type: "conjunction",
});
const listFormatShort = new Intl.ListFormat(undefined, {
  style: "short",
  type: "conjunction",
});

type FormatListOptions = {
  style?: "long" | "short";
};

export function formatList(
  x: string[],
  options?: Partial<FormatListOptions>,
): string {
  if (x.length === 0) {
    return "(None)";
  }

  if (options?.style === "short") {
    return listFormatShort.format(x);
  } else {
    return listFormatLong.format(x);
  }
}
