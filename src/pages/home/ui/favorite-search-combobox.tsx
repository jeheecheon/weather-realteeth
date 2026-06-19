import { type Nullable } from "@/shared/lib";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/shared/ui";
import { useEffect, useRef } from "react";
import { useDistrictSearch } from "../lib/use-district-search";
import { type District } from "../model/district";

type FavoriteSearchComboboxProps = {
  className?: string;
  autoFocus?: boolean;
  onSelectDistrict: (district: District) => void;
};

export function FavoriteSearchCombobox({
  className,
  autoFocus = false,
  onSelectDistrict,
}: FavoriteSearchComboboxProps) {
  const { query, setQuery, searchResults } = useDistrictSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!autoFocus) {
      return;
    }

    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [autoFocus]);

  return (
    <Combobox
      className={className}
      items={searchResults}
      inputValue={query}
      itemToStringLabel={getDistrictLabel}
      itemToStringValue={getDistrictLabel}
      open={query.trim().length > 0}
      onInputValueChange={setQuery}
      onValueChange={handleValueChange}
    >
      <ComboboxInput ref={inputRef} placeholder="장소 검색" />

      <ComboboxContent>
        <ComboboxEmpty>해당 장소의 정보가 제공되지 않습니다.</ComboboxEmpty>
        <ComboboxList>
          {(district: District) => (
            <ComboboxItem key={district.name} value={district}>
              <span className="min-w-0 truncate text-body-sm">{district.name}</span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );

  function handleValueChange(district: Nullable<District>) {
    if (!district) {
      return;
    }

    onSelectDistrict(district);
    setQuery("");
  }
}

function getDistrictLabel(district: District) {
  return district.name;
}
