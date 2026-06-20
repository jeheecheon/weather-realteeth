import { BottomSheet, Input } from "@/shared/ui";
import { MapPinOffIcon, SearchIcon } from "lucide-react";
import { useState, type SyntheticEvent } from "react";
import { useDistrictSearch } from "../lib/use-district-search";
import { type District } from "../model/district";

type FavoriteSearchPanelTriggerProps = {
  className?: string;
  onSelectDistrict: (district: District) => void;
};

export function FavoriteSearchPanelTrigger({
  className,
  onSelectDistrict,
}: FavoriteSearchPanelTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { query, setQuery, searchResults } = useDistrictSearch();

  return (
    <>
      <Input
        className={className}
        variant="search"
        placeholder="장소 검색"
        readOnly
        onClick={handleTriggerClick}
      />

      <BottomSheet
        className="data-[vaul-drawer-direction=bottom]:h-[90vh] data-[vaul-drawer-direction=bottom]:max-h-[90vh]"
        isOpen={isOpen}
        title="장소 검색"
        onClose={handleSheetClose}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-md">
          <Input
            variant="search"
            placeholder="장소 검색"
            value={query}
            autoFocus
            onChange={handleQueryChange}
          />

          <div className="scrollbar-hidden flex min-h-0 flex-1 flex-col overflow-auto rounded-lg border border-hairline bg-canvas">
            {query.trim().length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-xs px-md py-md text-center text-body-sm text-meta">
                <SearchIcon className="size-6" />
                검색 결과가 이곳에 표시됩니다.
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((district) => (
                <button
                  key={district.name}
                  className="flex w-full items-center px-md py-sm text-left text-body-sm text-ink transition-colors hover:bg-surface-soft"
                  type="button"
                  onClick={() => handleSelectResult(district)}
                >
                  <span className="min-w-0 truncate">{district.name}</span>
                </button>
              ))
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-xs px-md py-md text-center text-body-sm text-meta">
                <MapPinOffIcon className="size-6" />
                해당 장소의 정보가 제공되지 않습니다.
              </div>
            )}
          </div>
        </div>
      </BottomSheet>
    </>
  );

  function handleTriggerClick() {
    setIsOpen(true);
  }

  function handleSheetClose() {
    setIsOpen(false);
  }

  function handleQueryChange(event: SyntheticEvent<HTMLInputElement>) {
    setQuery(event.currentTarget.value);
  }

  function handleSelectResult(district: District) {
    onSelectDistrict(district);
    setQuery("");
    setIsOpen(false);
  }
}
