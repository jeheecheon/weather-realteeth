import { type Nullable } from "@/shared/lib";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/shared/ui";
import type { ComboboxRootChangeEventDetails } from "@base-ui/react/combobox";
import { MapPinOffIcon } from "lucide-react";
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
      autoHighlight
      items={searchResults}
      inputValue={query}
      itemToStringLabel={getDistrictLabel}
      itemToStringValue={getDistrictLabel}
      onInputValueChange={handleInputValueChange}
      onValueChange={handleValueChange}
    >
      <ComboboxInput ref={inputRef} placeholder="장소 검색" />

      <ComboboxContent>
        <ComboboxEmpty className="text-caption">
          <div className="flex min-h-24 flex-col items-center justify-center gap-xs px-md text-center text-meta">
            <MapPinOffIcon className="size-6" />
            해당 장소의 정보가 제공되지 않습니다.
          </div>
        </ComboboxEmpty>
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

  function handleInputValueChange(value: string, eventDetails: ComboboxRootChangeEventDetails) {
    if (eventDetails.reason === "item-press") {
      return;
    }

    setQuery(value);
  }
}

function getDistrictLabel(district: District) {
  return district.name;
}
