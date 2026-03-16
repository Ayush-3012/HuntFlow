export function buildSearchTokens(...queries: Array<string | null | undefined>) {
  return queries
    .join(" ")
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

export function matchesSearchTokens(
  tokens: string[],
  values: Array<string | number | null | undefined>
) {
  if (tokens.length === 0) return true;

  const haystack = values
    .filter((value) => value !== null && value !== undefined)
    .map((value) => String(value).toLowerCase())
    .join(" ");

  return tokens.every((token) => haystack.includes(token));
}
