import { useMemo, useState } from "react";
import { districts, type District } from "../model/district";

const MAX_SEARCH_RESULTS = 8;

export function useDistrictSearch() {
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => searchDistricts(query), [query]);

  return { query, setQuery, searchResults };
}

function searchDistricts(query: string): District[] {
  const tokens = query.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return [];
  }

  return districts
    .filter((district) => {
      const isAllMatching = tokens.every((token) => district.name.includes(token));
      return isAllMatching;
    })
    .slice(0, MAX_SEARCH_RESULTS);
}
